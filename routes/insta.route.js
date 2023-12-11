const express = require("express");
const {
   GetAllinstapost, getAllinstasinglepost, getMyPost, createPost, editpost, deletepost
} = require("../controllers/insta.controller");
const { authenticate } = require("../middleware/authenticate");
const InstaRouter = express.Router();

/*** these are private  */

InstaRouter.post("/createpost", authenticate , createPost);
InstaRouter.post("/mypost", getMyPost);
InstaRouter.patch("/instapost/:id",editpost)
InstaRouter.delete("/instapost/:id",deletepost)

/** Public user */
InstaRouter.get("/instapost", GetAllinstapost);
InstaRouter.get("/:id",getAllinstasinglepost)

module.exports = InstaRouter;
