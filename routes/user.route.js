const express = require("express");
const {
  Registeruser,
  getAllUsers,
  loginUser,updateUserById, getUserById, DeletedUserById, followUser, unfollowUser
} = require("../controllers/user.controller");
const { authenticate } = require("../middleware/authenticate");

const userRouter = express.Router();

userRouter.post("/register",  Registeruser);
userRouter.post("/login", loginUser);
userRouter.get("/",authenticate, getAllUsers);
userRouter.patch("/:id",authenticate ,updateUserById)


userRouter.get("/single/:id",getUserById)
userRouter.delete("/delete/:id",authenticate ,DeletedUserById)

/*** Follow and unfollow  */

userRouter.put("/follow/:followid",authenticate, followUser)
userRouter.put("/unfollow/:unfollowId",authenticate, unfollowUser)

module.exports = userRouter;
