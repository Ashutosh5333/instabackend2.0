const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    chatId: { type: mongoose.Types.ObjectId, ref: "chat" }, // References the 'chat' model
    senderId: { type: mongoose.Types.ObjectId, ref: "user" }, // References the 'user' model
    text: String
}, {
    timestamps: true,
});

const Messagemodel = mongoose.model("message", MessageSchema);

module.exports = { Messagemodel };
