const {encrypt, decrypt} = require("../utils/encryption");
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
        const newUser = await userModel.registerNewUser(username, email, password);
        // auto create biodata while create new user
        userModel.createBiodata(newUser.id);
        res.statusCode = 201;
        return res.json({message: `registration successful`});
      }
    } catch (error) {
      return res.status(500).send({message: error.message});
    }
  };

  loginExistingUser = async (req, res) => {
    const {email, password} = req.body;

    try {
      const registeredUser = await userModel.getRegisteredUser(email, password);
      if (registeredUser) {
        const manipulatedData = {
          encryptedId: encrypt(registeredUser.id.toString()),
          username: registeredUser.username,
        };
        const token = jwt.sign(manipulatedData, process.env.SECRET_KEY, {expiresIn: "1d"});
        return res.json({accessToken: token});
      } else if (!registeredUser) {
        const registeredEmail = await userModel.getExistingEmail(email);
        if (!registeredEmail) {
          res.statusCode = 404;
          return res.json({message: `user with email: ${email} not found`});
        }
        res.statusCode = 401;
        return res.json({message: "password is incorrect!"});
      }
    } catch (error) {
      return res.status(500).send({message: error.message});
    }
  };

  getUserDetailByToken = async (req, res) => {
    const {encryptedId} = req.token;
    const id = decrypt(encryptedId);

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
      return res.status(500).send({message: error.message});
    }
  };

  getUserBiodata = async (req, res) => {
    const {encryptedId} = req.token;
    const id = decrypt(encryptedId);

    try {
      const userBiodata = await userModel.getUserBiodata(id);
      const manipulatedBio = {
        username: userBiodata.User.username,
        firstName: userBiodata.firstName,
        lastName: userBiodata.lastName,
        info: userBiodata.infoBio,
        address: userBiodata.address,
        birthDate: userBiodata.birthDate ? formatDate(userBiodata.birthDate) : null,
        gender: userBiodata.gender,
        joinAt: formatDate(userBiodata.User.createdAt),
      };
      return res.json(manipulatedBio);
    } catch (error) {
      return res.status(500).send({message: error.message});
    }
  };

  updateUserBiodata = async (req, res) => {
    const {encryptedId} = req.token;
    const id = decrypt(encryptedId);
    const userData = req.body;

    try {
      if (Object.keys(userData).length > 0) {
        userModel.updateBiodata(id, userData);
        return res.json({message: "success update biodata"});
      } else {
        return res.json({message: "nothing to updated"});
      }
    } catch (error) {
      return res.status(500).send({message: error.message});
    }
  };
}

module.exports = new UserController();
