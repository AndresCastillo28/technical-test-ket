const express = require("express");
const http = require('http');
const { sendResponse } = require("./utils/responseHandler");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const initSocket = require('./sockets/socketConfig');

const PORT = process.env.PORT || 3000;

app.use(cors());
connectDB();

app.get("/", (req, res) => {
  sendResponse(res, true, 200, "Api running! Happy hacking...");
});

app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/roles", require("./routes/role"));
app.use("/api/messages", require("./routes/messages"));


initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;