// controllers/messageController.js

const { Messagemodel } = require("../models/message.modal");


   /*** Create message */


const createMessage = async (req, res) => {
  try {
    const { chatId, senderId, text } = req.body;
    const newMsg = await new Messagemodel({ chatId, senderId, text }).populate({
      path: 'senderId',
      select: 'name', // Populate name and info fields
    });
    const response = await newMsg.save();
    res.status(200).json(response);
  } catch (err) {
    console.error("error", err);
    res.status(500).json(err);
  }
};

const getMessagesByChatId = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Messagemodel.find({ chatId });
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const welcomeMessage = (req, res) => {
  res.send("Welcome to chat");
};

module.exports = {
  createMessage,
  getMessagesByChatId,
  welcomeMessage,
};
