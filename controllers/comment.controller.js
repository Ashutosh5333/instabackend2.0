
const catchAsyncErrors = require("../middleware/catchError"); 
const { InstaModel } = require("../models/Insta.model");
const { Usermodel } = require("../models/User.model");
const {CommentModel} = require("../models/comment.model");


    /*********   Add  comments  */

const AddComment = async (req, res) => {
     const userId = req.userId
     console.log("userid********",userId)
    try {
      // GET POST AND USER
      const post = await InstaModel.findById(req.params.id).populate('comments');
      const user = await Usermodel.findById(userId);
        console.log("userdata",user)
      console.log("user******",userId)
      console.log("post***********",post)

      // CHECK IF POST ID IS VALID
      if (!post) return res.status(404).send('Post not found');
  
      // CREATE COMMENT
      const comment = new CommentModel({
        user: user._id,
        text: req.body.text,
        name: user.name,
      });
  
      // SAVE COMMENT
      await comment.save();
  
      // ADD COMMENT TO POST
      post.comments.unshift(comment);
      await post.save();
  
      res.send({ msg: 'Comment added successfully', comments: post.comments });
    } catch (error) {
      console.log(error);
      res.status(400).send('Internal Server error');
    }
  };

     /********* Delete comments  */

  const deleteComment = async (req, res) => {
     const userId =  req.userId
    try {
      const post = await InstaModel.findById(req.params.id).populate('comments');
      const comment = await CommentModel.findById(req.params.comment_id);
  
      if (!comment) return res.status(404).send('Invalid comment id.');
  
      if (userId != comment.user.toString())
        return res.status(401).send('Authorization failed.');
  
      await CommentModel.findByIdAndDelete(req.params.comment_id);
  
      const removeIndex = post.comments
        .map((comment) => comment._id.toString())
        .indexOf(req.params.comment_id);
  
      if (removeIndex < 0) return res.status(404).send('Invalid comment id.');
  
      post.comments.splice(removeIndex, 1);
      await post.save();
  
      res.send({
        msg: 'Comment deleted successfully.',
        comments: post.comments,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send('Internal Server error.');
    }
  };

  module.exports = {
    AddComment,
    deleteComment
  };