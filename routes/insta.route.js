const express = require("express");
const {
   GetAllinstapost, getAllinstasinglepost, getMyPost, createPost, editpost, deletepost, likeProduct, unlikeProduct
} = require("../controllers/insta.controller");
const { authenticate } = require("../middleware/authenticate");
const { validateInstaData } = require("../validation/instavalidator");
const InstaRouter = express.Router();

/*** these are private  */

InstaRouter.post("/createpost", authenticate ,validateInstaData, createPost);
InstaRouter.get("/mypost", authenticate, getMyPost);
InstaRouter.patch("/instapost/:id",authenticate,editpost)
InstaRouter.delete("/instadelete/:id",authenticate, deletepost)

/*** Likes and Unlike and comment */
InstaRouter.put("/instapostlike/:id", authenticate, likeProduct);
InstaRouter.put("/instapostunlike/:id",authenticate,unlikeProduct)


/** Public user */ 
InstaRouter.get("/instapost", GetAllinstapost);
InstaRouter.get("/:id",getAllinstasinglepost);


module.exports = InstaRouter;
