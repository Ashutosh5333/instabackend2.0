const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CommentSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  avatar_url: {
    type: String,
  },
  replies: [
    {
      user: {
        type: Schema.Types.ObjectId,
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar_url: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const CommentModel = model("comment", CommentSchema);

module.exports = { CommentModel };









// const mongoose = require("mongoose");

// const CommentSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Types.ObjectId, ref:"user"
//   },
//   text: {
//     type: String,
//     required: true,
//   },
//   name: {
//     type: String,
//   },
//   avatar_url: {
//     type: String,
//   },
//   replies: [
//     {
//       user: {
//         type: mongoose.Types.ObjectId,
//         ref:"user"
//       },
//       text: {
//         type: String,
//         required: true,
//       },
//       name: {
//         type: String,
//       },
//       avatar_url: {
//         type: String,
//       },
//       date: {
//         type: Date,
//         default: Date.now,
//       },
//     },
//   ],
//   date: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const CommentModel = mongoose.model("comment", CommentSchema);

// module.exports = { CommentModel };
