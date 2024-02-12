const userModel = require("./user.model");
const jwt = require("jsonwebtoken");

class UserController {
  registerUser = async (req, res) => {
    const {username, email, password} = req.body;

    try {
      const existedUsername = await userModel.getExistingUsername(username);
      const existedEmail = await userModel.getExistingEmail(email);
      if (existedUsername) {
        res.statusCode = 409;
        res.json({message: `${username} username has been used, try another!`});
      } else if (existedEmail) {
        res.statusCode = 409;
        res.json({message: `${email} has been used in another account`});
      } else {
        userModel.registerNewUser(username, email, password);
        res.statusCode = 201;
        res.json({message: `registration successful`});
      }
    } catch (error) {
      return res.status(500).send({message: `${error}`});
    }
  };

  loginExistingUser = async (req, res) => {
    const {email, password} = req.body;

    try {
      const registeredUser = await userModel.getRegisteredUser(email, password);
      if (registeredUser) {
        const token = jwt.sign({...registeredUser}, process.env.SECRET_KEY, {expiresIn: 60 * 60});
        return res.json({accessToken: token});
      } else if (!registeredUser) {
        const registeredEmail = await userModel.getExistingEmail(email);
        const registeredPassword = await userModel.getPassword(password);
        if (!registeredEmail) {
          res.statusCode = 404;
          res.json({message: `User with the provided email not found`});
        } else if (!registeredPassword) {
          res.statusCode = 401;
          res.json({message: "password is incorrect!"});
        }
      }
    } catch (error) {
      return res.status(500).send({message: `${error}`});
    }
  };
}

module.exports = new UserController();
