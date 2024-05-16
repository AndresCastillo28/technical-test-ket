const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model("chatMessage", ChatMessageSchema);
