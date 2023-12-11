const express = require("express");
const {
  Registeruser,
  getAllUsers,
  loginUser,updateUserById, getUserById, DeletedUserById
} = require("../controllers/user.controller");
const { authenticate } = require("../middleware/authenticate");
const userRouter = express.Router();

userRouter.post("/register",  Registeruser);
userRouter.post("/login", loginUser);
userRouter.get("/", getAllUsers);
userRouter.patch("/:id",updateUserById)
userRouter.get("/single/:id",getUserById)
userRouter.delete("/delete/:id",DeletedUserById)

module.exports = userRouter;
