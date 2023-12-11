const catchAsyncErrors = require("../middleware/catchError");
const { Usermodel } = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Registeruser = catchAsyncErrors(async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    const userPresent = await Usermodel.findOne({ email });
    if (userPresent) {
      return res.status(400).json({ msg: "User is already present" });
    }

    bcrypt.hash(password, 4, async (err, hash) => {
      console.log("hasssh", hash);
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error in hashing password" });
      }
      try {
        const user = new Usermodel({ email, password: hash, name });
        await user.save();
        console.log("uerrrrpasssword", hash);
        res.status(201).json({ msg: "Signup successful" });
      } catch (error) {
        console.error("error form 53", error);
        res
          .status(500)
          .json({ msg: "Something went wrong, please try again later" });
      }
    });
  } catch (error) {
    console.error("error form 58", error);
    res
      .status(500)
      .json({ msg: "Something went wrong, please try again later" });
  }
});

const loginUser = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Usermodel.findOne({ email })
    // console.log("User:", user);
    const hashed_password = user.password;
    // console.log("Hashed Password:", hashed_password);

    if (!hashed_password) {
      return res.send("Hashed password not found");
    }
    if (!user) {
      return res.send("User not registered");
    }

    
    const passwordMatch = await new Promise((resolve, reject) => {
      bcrypt.compare(password, hashed_password, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    // console.log("password", password);

    if (passwordMatch) {
      const token = jwt.sign({ userId: user._id }, "hush");
      return res.send({
        msg: "Login successful",
          token: token,
        data: {
          name: user.name,
          email: user.email,
          _id: user._id,
        },
      });
    } else {
      return res.send("Please check password");
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.send("Authentication failed");
  }
});

const getAllUsers = async (req, res) => {
  try {
    res.send("All user");
  } catch (err) {
    res.send("somting went wrong");
  }
};

module.exports = { Registeruser, getAllUsers, loginUser };
