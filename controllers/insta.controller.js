const Joi = require("joi");
const catchAsyncErrors = require("../middleware/catchError"); // Assuming you have this middleware defined
const { InstaModel, instaValidationSchema } = require("../models/Insta.model");

const GetAllinstapost = catchAsyncErrors(async (req, res) => {
  try {
    const product = await InstaModel.find()
      .populate("postedby", ["name", "email", "image"])
      .populate("comments.postedby", ["name", "_id", "image", "username"]);
    res.send(product);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

const getAllinstasinglepost = catchAsyncErrors(async (req, res) => {
  const prodId = req.params.prodId;
  const userId = req.body.userId;
  try {
    const product = await InstaModel.find({ userId: prodId })
      .populate("postedby", ["name", "email", "image"])
      .populate("comments.postedby", ["name", "_id", "image", "username"]);
    res.send(product);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

const getMyPost = catchAsyncErrors(async (req, res) => {
  try {
    const productData = await InstaModel.find({
      userId: req.body.userId,
    }).populate("postedby", ["name", "email", "image", "username"]);
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
    // console.log("instapost **********data ", instaPost);
    res
      .status(201)
      .json({ message: "Insta post created successfully", data: instaPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const editpost = catchAsyncErrors(async (req, res) => {
  const prodId = req.params.id;
  const userId = req.body.userId;
  const payload = req.body;

  try {
    const productData = await InstaModel.findOne({ _id: prodId });
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

const deletepost = catchAsyncErrors(async (req, res) => {
  const prodId = req.params.id;
  const userId = req.body.userId;

  try {
    const productData = await InstaModel.findOne({ _id: prodId });
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

const likeProduct = catchAsyncErrors(async (req, res) => {
  const userId = req.body.userId;

  try {
    const result = await InstaModel.findByIdAndUpdate(
      req.params.postId,
      {
        $push: { likes: userId },
      },
      { new: true }
    ).exec();
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(422).json({ error: err });
  }
});

const unlikeProduct = catchAsyncErrors(async (req, res) => {
  const userId = req.body.userId;

  try {
    const result = await InstaModel.findByIdAndUpdate(
      req.params.postId,
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
  const userId = req.body.userId;
  const comment = {
    text: req.body.text,
    postedby: userId,
  };

  try {
    const result = await InstaModel.findByIdAndUpdate(
      req.params.postId,
      {
        $push: { comments: comment },
      },
      {
        new: true,
      }
    )
      .populate("comments.postedby", ["name", "_id", "image", "username"])
      .populate("postedby", ["name", "_id", "image", "username"])
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
