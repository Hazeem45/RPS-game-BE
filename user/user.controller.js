const formatDate = require("../utils/formatDate");
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
        return res.json({message: `${username} is already used, try another!`});
      } else if (existedEmail) {
        res.statusCode = 409;
        return res.json({message: `${email} is alredy used on another account`});
      } else {
        userModel.registerNewUser(username, email, password);
        res.statusCode = 201;
        return res.json({message: `registration successful`});
      }
    } catch (error) {
      return res.status(500).send({message: error});
    }
  };

  loginExistingUser = async (req, res) => {
    const {email, password} = req.body;

    try {
      const registeredUser = await userModel.getRegisteredUser(email, password);
      if (registeredUser) {
        const token = jwt.sign(registeredUser, process.env.SECRET_KEY, {expiresIn: "1d"});
        return res.json({accessToken: token});
      } else if (!registeredUser) {
        const registeredEmail = await userModel.getExistingEmail(email);
        console.log(registeredEmail);
        if (!registeredEmail) {
          res.statusCode = 404;
          return res.json({message: `user with email: ${email} not found`});
        }
        res.statusCode = 401;
        return res.json({message: "password is incorrect!"});
      }
    } catch (error) {
      return res.status(500).send({message: error});
    }
  };

  getUserDetailByToken = async (req, res) => {
    const {id} = req.token;
    try {
      const userDetail = await userModel.getUserById(id);
      const manipulatedData = {
        id: userDetail.id,
        username: userDetail.username,
        email: userDetail.email,
        joinAt: formatDate(userDetail.createdAt),
      };
      return res.json(manipulatedData);
    } catch (error) {
      return res.status(500).send({message: error});
    }
  };

  getUserBiodata = async (req, res) => {
    const {id} = req.token;
    try {
      const userBiodata = await userModel.getUserBiodata(id);
      const manipulatedBio = {
        userId: userBiodata.userId,
        username: userBiodata.User.username,
        fullname: `${userBiodata.firstName} ${userBiodata.lastName}`,
        info: userBiodata.infoBio,
        address: userBiodata.address,
        birthDate: formatDate(userBiodata.birthDate),
        gender: userBiodata.gender,
        joinAt: formatDate(userBiodata.User.createdAt),
      };
      return res.json(manipulatedBio);
    } catch (error) {
      return res.status(500).send({message: error});
    }
  };

  updateUserBiodata = async (req, res) => {
    const {id} = req.token;
    const userData = req.body;
    try {
      const userBiodata = await userModel.getUserBiodata(id);
      if (userBiodata !== null) {
        userModel.updateBiodata(id, userData);
      } else if (userBiodata === null) {
        userModel.createBiodata(id, userData);
      }
      return res.json({message: "success update biodata"});
    } catch (error) {
      return res.status(500).send({message: error});
    }
  };
}

module.exports = new UserController();
