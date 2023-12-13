const catchAsyncErrors = require("../middleware/catchError");
const { Usermodel } = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/*** Register user */

const Registeruser = catchAsyncErrors(async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    const userPresent = await Usermodel.findOne({ email });
    if (userPresent) {
      return res.status(400).json({ msg: "User is already present" });
    }

    bcrypt.hash(password, 4, async (err, hash) => {
      // console.log("hasssh", hash);
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error in hashing password" });
      }
      try {
        const user = new Usermodel({ email, password: hash, name });
        await user.save();
        // console.log("uerrrrpasssword", hash);
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

/**** Login user  */

const loginUser = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Usermodel.findOne({ email });
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

/*** Get All users  */

const getAllUsers = async (req, res) => {
  try {
    const Alluser = await Usermodel.find().
    populate("followers",["_id","name"])
    res.send({ Alluserdata: Alluser });
  } catch (err) {
    res.send("somting went wrong");
  }
};

 /*** Get  single user data  */

const getUserById = async (req, res) => {
  const uId = req.params.id;
  try {
      const user = await Usermodel.findById( uId )
     console.log("userdata",user)
       if(!user){
         res.status(500).json({ success: false, message: "User Not Found" });
       }
       const Userdata = await Usermodel.findById(uId).select("-password");
       res.status(200).json({
         success: true,
         Userdata,
       });
  } catch (err) {
    console.log(err);
    res.send({ msg: "Something went wrong" });
  }
};

 /*** Updated user by id */

const updateUserById = async (req, res) => {
  const uId = req.params.id;
  const payload = req.body;

  const userdata = await Usermodel.findById(uId);
  if (!userdata) {
    res.status(500).json({ success: false, message: "userdata Not Found" });
  }
  try {
    const Userdata = await Usermodel.findByIdAndUpdate(uId, payload, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      msg: "Data updated successfully",
      Userdata,
    });
  } catch (err) {
    console.log(err);
    res.send({ msg: "Something went wrong" });
  }
};

 /*** Deleted user by id */

 const DeletedUserById = async (req, res) => {
    const uId = req.params.id;
  
    const userdata = await Usermodel.findById(uId);
    if (!userdata) {
      res.status(500).json({ success: false, message: "userdata Not Found" });
    }
    try {
      await Usermodel.findByIdAndDelete(uId);

      res.status(200).json({
        success: true,
        msg: "Deleted user successfully",
      });
    } catch (err) {
      console.log(err);
      res.send({ msg: "Something went wrong" });
    }
  };


  const followUser = async (req, res) => {
    try {
      const userId = req.userId; // Assuming the authenticated user's ID is in req.user._id
      const followId = req.params.followid; // Assuming the ID of the user to follow is in req.body.followId
     
       console.log("userid********",userId)
       console.log("followid********",followId)
      // Update the user being followed (add follower)
      const followedUser = await Usermodel.findByIdAndUpdate(
        followId,
        { $push: { followers: userId } },
        { new: true }
      );
  
      // Update the authenticated user (add followee)
      const currentUser = await Usermodel.findByIdAndUpdate(
        userId,
        { $push: { following: followId } },
        { new: true }
      );
  
      res.json({ followedUser, currentUser });
    } catch (error) {
      res.status(422).json({ error: error.message });
    }
  };
  
  
  
  const unfollowUser = async (req, res) => {
    try {
      const userId = req.userId;
      const unfollowId = req.params.unfollowId;
  
      await Usermodel.findByIdAndUpdate(unfollowId, {
        $pull: { followers: userId }
      }, { new: true });
  
      const updatedUser = await Usermodel.findByIdAndUpdate(userId, {
        $pull: { following: unfollowId }
      }, { new: true });
  
      res.json(updatedUser);
    } catch (err) {
      res.status(422).json({ error: err.message });
    }
  };


module.exports = { Registeruser, getAllUsers, loginUser, updateUserById ,getUserById 
  ,DeletedUserById ,followUser ,unfollowUser };
