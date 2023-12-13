const express = require("express");

const { authenticate } = require("../middleware/authenticate");
const { AddComment, deleteComment } = require("../controllers/comment.controller");

const commentRouter = express.Router();
 
 
     /**** Comment post by comment/:id */

commentRouter.post("/comments/:id", authenticate , AddComment);
      
      /*** Comment delete  */

commentRouter.delete("/comments/:id/:comment_id", authenticate,deleteComment);

  module.exports=commentRouter;