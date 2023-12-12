// validations/instaValidator.js
const Joi = require("joi");

const instaValidationSchema = Joi.object({
  description: Joi.string().min(10).max(200).required().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description cannot be empty",
    "string.min": "Description should be at least {#limit} characters long",
    "string.max": "Description should not exceed {#limit} characters",
  }),
  title: Joi.string().min(5).max(50).required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title cannot be empty",
    "string.min": "Title should be at least {#limit} characters long",
    "string.max": "Title should not exceed {#limit} characters",
  }),
  pic: Joi.array().items(Joi.string()),
  userId: Joi.string().required().messages({
    "string.base": "UserID must Required",
  }),
  likes: Joi.array().items(Joi.string()),
  comments: Joi.array().items(
    Joi.object({
      text: Joi.string().allow(""),
      postedby: Joi.string(),
    })
  ),
  postedby: Joi.string().optional().messages({
    "string.base": "Postedby must be a string",
    "string.empty": "Postedby cannot be empty",
  }),
});

const validateInstaData = (req, res, next) => {
    console.log("userid****validator",req.body.userId)
  const userdata = {
    ...req.body,
    postedby: req.userId,
    userId:req.userId
  };

  const { error, value } = instaValidationSchema.validate(userdata);

  if (error) {
    return res
      .status(400)
      .json({ error: error.details.map((err) => err.message) });
  }
  req.body = value;
  next();
};

module.exports = { validateInstaData };
