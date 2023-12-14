const express = require("express")
const { createChat, FindUserchats, getChatByUserIds } = require("../controllers/chat.controller")

const chatRouter = express.Router()

chatRouter.post("/",createChat)
chatRouter.get("/:userId",FindUserchats)
chatRouter.get("/find/:firstId/:secondId",getChatByUserIds)


module.exports=chatRouter
