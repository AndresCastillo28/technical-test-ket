const socketIo = require("socket.io");
const ChatMessage = require("../models/ChatMessage");
const jwt = require("jsonwebtoken");

const connectedUsers = {}; 

function initSocket(server) {

  const io = socketIo(server, {
    cors: {
      origin: "*", // Set the real value
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (!token) {
      return next(new Error("Authentication error: Token not found"));
    }

    jwt.verify(token, process.env.SECRET_JWT_SEED, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error: Invalid token"));
      }
      socket.decoded = decoded;
      next();
    });
  });

  io.on("connection", (socket) => {
    console.log("User connected.")
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
    const { uid, name } = socket.decoded;
    connectedUsers[socket.id] = { uid, name }; 
    io.emit("users online", Object.values(connectedUsers));

    socket.on('disconnect', () => {
      delete connectedUsers[socket.id]; 
      io.emit('users online', Object.values(connectedUsers));
  });

    socket.on("ping_with_token", (token) => {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_JWT_SEED);
        socket.emit("pong", { status: "valid" });
      } catch (error) {
        socket.emit("pong", { status: "invalid" });
        socket.disconnect(true);
      }
    });

    socket.on("some_event", (data) => {
      const newMessage = new ChatMessage({
        message: data.message,
        user: data.user,
      });

      newMessage
        .save()
        .then((savedMessage) => {
          return ChatMessage.findById(savedMessage._id).populate({
            path: "user",
            model: "user",
            populate: {
              path: "role",
              model: "role",
            },
          });
        })
        .then((populatedMessage) => {
          io.emit("message_saved", populatedMessage);
        })
        .catch((error) => {
          console.error("Error saving or populating message:", error);
        });
    });
  });

  return io;
}

module.exports = initSocket;
