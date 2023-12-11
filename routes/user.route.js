const express = require("express");
const {
  Registeruser,
  getAllUsers,
  loginUser,
} = require("../controllers/user.controller");
const userRouter = express.Router();

userRouter.post("/register", Registeruser);
userRouter.post("/login", loginUser);
userRouter.get("/", getAllUsers);

module.exports = userRouter;
