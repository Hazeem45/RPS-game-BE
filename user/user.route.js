const express = require("express");
const userController = require("./user.controller");
const authorization = require("../middleware/authorization");
const userRouter = express();

userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.loginExistingUser);
userRouter.get("/", authorization, userController.getUserDetailByToken);
userRouter.put("/biodata", authorization, userController.updateUserBiodata);
userRouter.get("/biodata", authorization, userController.getUserBiodata);

module.exports = userRouter;
