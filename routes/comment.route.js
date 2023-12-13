const express = require("express");

const { authenticate } = require("../middleware/authenticate");
const {
  AddComment,
  deleteComment,
  addReply,
  deleteReply,
} = require("../controllers/comment.controller");

const commentRouter = express.Router();

/**** Comment post by comment/:id */

commentRouter.post("/comments/:id", authenticate, AddComment);

/*** Comment delete  */

commentRouter.delete("/comments/:id/:comment_id", authenticate, deleteComment);

/*** Comment Reply  */

commentRouter.post("/comments/replies/:comment_id", authenticate, addReply);

  /*** Comment replies delete  */

commentRouter.delete("/comments/replies/:comment_id/:reply_id", authenticate, deleteReply);


module.exports = commentRouter;
