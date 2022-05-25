var mongoose = require("mongoose");

var chatSchema = new mongoose.Schema({
    username: String,
    message: String,
    room: String
});

module.exports = mongoose.model("Chats", chatSchema);