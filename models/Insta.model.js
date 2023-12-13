const mongoose = require("mongoose");


const instaSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Please provide a description"],
      minlength: [10, "Description should be at least 10 characters long"],
      maxlength: [200, "Description should not exceed 200 characters"],
    },
    title: {
      type: String,
      required: [true, "Please provide a title"],
      minlength: [5, "Title should be at least 5 characters long"],
      maxlength: [50, "Title should not exceed 50 characters"],
    },
    pic: {
      type: [String],
      default: ["default-pic.jpg"],
    },
    userId: {
      type: String,
      required:true
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",default:[]
      },
    ],
    // comments: [
    //   {
    //     text: {
    //       type: String,
    //     },
    //     postedby: {
    //       type: mongoose.Types.ObjectId,
    //       ref: "user",
    //     },
    //   },
    // ],
    comments: [{ type: mongoose.Types.ObjectId, ref: "comment", default: [] }],

    postedby: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: [true, "Please provide the ID of the user who posted"],
    },
  },
  {
    timestamps: true,
  }
);

const InstaModel = mongoose.model("insta", instaSchema);

module.exports = {
  InstaModel,
};
