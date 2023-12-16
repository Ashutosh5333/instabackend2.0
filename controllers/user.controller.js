const catchAsyncErrors = require("../middleware/catchError");
const { Usermodel } = require("../models/User.model");
const { ObjectId } = require('mongoose').Types;
// const mongoose = require('mongoose');
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

    if (!user) {
      return res.status(404).send({msg:"User not registered"});
    }

    const hashedPassword = user.password;

    if (!hashedPassword) {
      return res.status(500).send("Hashed password not found");
    }

    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (passwordMatch) {
      const token = jwt.sign({ userId: user._id }, "hush", { expiresIn: '1h' });

      return res.json({
        msg: "Login successful",
        token: token,
        data: {
          name: user.name,
          email: user.email,
          _id: user._id,
        },
      });
    } else {
      return res.status(401).send("Please check password");
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send("Authentication failed");
  }
});

/*** Get All users  */

const getAllUsers = async (req, res) => {
  try {
    const Alluser = await Usermodel.find().select("-password").
    populate("followers",["_id","name"])
    .populate("following",["_id","name"])
    res.send( Alluser );
  } catch (err) {
    res.send("somting went wrong");
  }
};

 /*** Get  single user data  */

const getUserById = async (req, res) => {
  const uId = req.params.id;
  try {
    // const userId = mongoose.Types.ObjectId(uId);
    const userId = new ObjectId(uId);
      // const user = await Usermodel.findById( userId )
    //  console.log("userdata",user)
    const Userdata = await Usermodel.findById(userId).select("-password");
       if(!Userdata){
         res.status(500).json({ success: false, message: "User Not Found" });
       }
       res.status(200).json(Userdata);
  } catch (err) {
    console.log(err);
    res.send({ msg: "Something went wrong" });
  }
};

 /*** Updated user by id */


const updateUserById = async (req, res) => {
  const uId = req.params.id;
  const payload = req.body;

  const userIdFromToken = req.userId; // Assuming the authenticated user ID is available in req.user._id
    console.log("userid*******",userIdFromToken)
  if (uId !== userIdFromToken) {
    return res.status(403).json({ success: false, message: "Unauthorized to update this profile" });
  }

  try {
    const userdata = await Usermodel.findById(uId);

    if (!userdata) {
      return res.status(404).json({ success: false, message: "User data not found" });
    }

    const updatedUserData = await Usermodel.findByIdAndUpdate(uId, payload, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }).select("-password");

    res.status(200).json({
      success: true,
      msg: "Data updated successfully",
      Userdata: updatedUserData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
};


 /*** Deleted user by id */


const DeletedUserById = async (req, res) => {
  const uId = req.params.id;

  const userIdFromToken = req.userId; // Assuming the authenticated user ID is available in req.user._id

  try {
    const userdata = await Usermodel.findById(uId);

    if (!userdata) {
      return res.status(404).json({ success: false, message: "User data not found" });
    }

    if (uId !== userIdFromToken) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this profile" });
    }

    await Usermodel.findByIdAndDelete(uId);

    res.status(200).json({
      success: true,
      msg: "Deleted user successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong" });
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
      ).select("-password");
  
      // Update the authenticated user (add followee)
      const currentUser = await Usermodel.findByIdAndUpdate(
        userId,
        { $push: { following: followId } },
        { new: true }
      ).select("-password");
  
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
      }, { new: true }).select("-password");
  
      const updatedUser = await Usermodel.findByIdAndUpdate(userId, {
        $pull: { following: unfollowId }
      }, { new: true }).select("-password");
  
      res.json(updatedUser);
    } catch (err) {
      res.status(422).json({ error: err.message });
    }
  };

  const findMutualFriends = async (req, res) => {
    const userId = req.params.userId;
  
       console.log("userId*****",userId)
    try {
      const user = await Usermodel.findById(userId);
         console.log("userdata*****",user)
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      const followers = user.followers;
      const following = user.following;
  
      // Find mutual friends by filtering followers who are also in the following array
      const mutualFriends = await Usermodel.find({
        _id: { $in: following },
        followers: { $in: followers },
      }).select("-password");
  
      res.status(200).json({
        success: true,
        count: mutualFriends.length,
        mutualFriends: mutualFriends,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: `Error finding mutual friends: ${error.message}` });
    }
  };

module.exports = { Registeruser, getAllUsers, loginUser, updateUserById ,getUserById 
  ,DeletedUserById ,followUser ,unfollowUser,findMutualFriends };
