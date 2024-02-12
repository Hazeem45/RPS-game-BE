const express = require("express");
const userController = require("./user.controller");
const userRouter = express();

userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.loginExistingUser);

module.exports = userRouter;
