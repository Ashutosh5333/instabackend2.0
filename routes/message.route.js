
const express = require("express");
const { createMessage, getMessagesByChatId } = require("../controllers/message.controller");
const meassageRouter = express.Router();


meassageRouter.post("/",createMessage)
meassageRouter.get("/:chatId",getMessagesByChatId)

module.exports=meassageRouter;