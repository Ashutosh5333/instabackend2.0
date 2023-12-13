const Joi = require("joi");
const catchAsyncErrors = require("../middleware/catchError"); // Assuming you have this middleware defined
const { InstaModel, instaValidationSchema } = require("../models/Insta.model");

// const GetAllinstapost = catchAsyncErrors(async (req, res) => {
//   try {
//     const product = await InstaModel.find()
//       .populate("postedby", ["name", "email", "image"])
//       .populate("likes","name")
//       .populate("comments","text")
//       .populate("comments.replies","text")
//     res.send(product);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

const GetAllinstapost = catchAsyncErrors(async (req, res) => {
  try {
    const product = await InstaModel.find()
      .populate({
        path: 'comments',
        populate: {
          path: 'replies',
          select: 'text date'
        }
      }).populate("postedby",["name"])
      .populate("likes","name")

    res.send(product);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});



const getAllinstasinglepost = catchAsyncErrors(async (req, res) => {
  const prodId = req.params.id;
  const userId = req.body.userId;
  try {
    const product = await InstaModel.find({ userId: prodId })
      .populate("postedby", ["name", "email", "image"])
      .populate("comments", ["name", "_id", "image", "username"]);
    res.send(product);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

const getMyPost = catchAsyncErrors(async (req, res) => {
      console.log("userid********",req.userId)
  try {
    const productData = await InstaModel.find({ userId: req.userId}).populate("postedby", ["name", "email", "image", "username"]);
    res.send(productData);
  } catch (err) {
    console.log(err);
    res.send("Not authorized");
  }
});

// const createPost = catchAsyncErrors(async (req, res) => {
//   const { title, description, userId } = req.body;
//  console.log("userid*********",userId)
//   // Define Joi schema for validation
//   const schema = Joi.object({
//     title: Joi.string().required(),
//     description: Joi.string().required(),
//     userId: Joi.string().required(), // Assuming userId is required
//   });
//   // Validate the request body against the schema
//   const { error } = schema.validate({ title, description, userId });
//   // If validation fails, respond with an error message
//   if (error) {
//     return res.status(400).json({ msg: error.details[0].message });
//   }
//   try {
//     const product = await InstaModel.create({ title, description, postedby: userId });
//     res.send({ msg: "Post created successfully", product });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Something went wrong" });
//   }
// });

const createPost = async (req, res) => {
  try {
    const instaPost = await InstaModel.create(req.body);
    console.log("instapost **********data ", instaPost);
    res
      .status(201)
      .json({ message: "Insta post created successfully", data: instaPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

    /*** Edit post */

const editpost = catchAsyncErrors(async (req, res) => {
  const prodId = req.params.id;
  const userId = req.userId;
  const payload = req.body;
         console.log("Userid***",userId)
  try {
    const productData = await InstaModel.findOne({ _id: prodId });
      console.log("productdata*********",productData.userId)
    if (userId !== productData.userId) {
      return res.status(401).send("You are not authorized");
    } else {
      const updatedProduct = await InstaModel.findByIdAndUpdate(
        { _id: prodId },
        payload,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
      res.status(200).json({
        success: true,
        msg: "Data updated successfully",
        updatedProduct,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Something went wrong" });
  }
});

 /*** Deleted post */

const deletepost = catchAsyncErrors(async (req, res) => {
  const prodId = req.params.id;
  const userId = req.userId;
//   console.log("userid*****",userId)

  try {
    const productData = await InstaModel.findOne({ _id: prodId });
    console.log("product*****",productData.userId)
    if (userId !== productData.userId) {
      return res.status(401).send("You are not authorized");
    } else {
      await InstaModel.findOneAndDelete({ _id: prodId });
      res.send({ msg: "Post deleted successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Something went wrong" });
  }
});

 /*** Like post */

const likeProduct = catchAsyncErrors(async (req, res) => {
  const userId = req.userId;
       console.log("useriflike*******",userId)
  try {
    const result = await InstaModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: { likes: userId },
      },
      { new: true }
    ).populate('likes', 'name').exec();
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(422).json({ error: err });
  }
});

  /*** UnLike post */

const unlikeProduct = catchAsyncErrors(async (req, res) => {
  const userId = req.userId;

  try {
    const result = await InstaModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: userId },
      },
      { new: true }
    ).exec();
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(422).json({ error: err });
  }
});

const addComment = catchAsyncErrors(async (req, res) => {
  const userId = req.userId;
   const {text} = req.body
  const comment = {
    text,
    postedby: userId,
  };

    console.log("comment payload",comment)
  try {
    const result = await InstaModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: { comments: comment },
      },
      {
        new: true,
      }
    )
      .populate("comments.postedby", ["name", "_id", "image", "username"])
      .exec();
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(422).json({ error: err });
  }
});


// Exporting the modified router

module.exports = {
  GetAllinstapost,
  getAllinstasinglepost,
  getMyPost,
  createPost,
  editpost,
  deletepost,
  likeProduct,
  unlikeProduct,
  addComment,
};
