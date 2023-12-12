const express = require("express");
const {
   GetAllinstapost, getAllinstasinglepost, getMyPost, createPost, editpost, deletepost
} = require("../controllers/insta.controller");
const { authenticate } = require("../middleware/authenticate");
const { validateInstaData } = require("../validation/instavalidator");
const InstaRouter = express.Router();

/*** these are private  */

InstaRouter.post("/createpost", authenticate ,validateInstaData, createPost);
InstaRouter.post("/mypost", authenticate, getMyPost);
InstaRouter.patch("/instapost/:id",editpost)
InstaRouter.delete("/instadelete/:id",deletepost)

/** Public user */ 
InstaRouter.get("/instapost", GetAllinstapost);
InstaRouter.get("/:id",getAllinstasinglepost);

module.exports = InstaRouter;
