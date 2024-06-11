const express = require("express");
const userController = require("./user.controller");
const authorization = require("../middleware/authorization");
const validation = require("../middleware/validation");
const {registrationSchema, loginSchema, biodataSchema, usernameSchema} = require("../utils/checkSchema");
const userRouter = express();

userRouter.post("/register", registrationSchema(), validation, userController.registerUser);
userRouter.post("/login", loginSchema(), validation, userController.loginExistingUser);
userRouter.put("/profile", usernameSchema(), validation, authorization, userController.changeUsername);
userRouter.put("/biodata", biodataSchema(), validation, authorization, userController.updateUserBiodata);
userRouter.get("/biodata", authorization, userController.getUserBiodata);
userRouter.get("/search-user", authorization, userController.getExistingUser);
userRouter.get("/:username", authorization, userController.getOtherUserDetailsAlsoTheirGameHistory);

module.exports = userRouter;
