const {base64EncodeURLSafe} = require("../utils/base64URLSafeCustom");
const {encrypt, decrypt} = require("../utils/encryption");
const userModel = require("./user.model");
const gameModel = require("../user-game/game.model");
const jwt = require("jsonwebtoken");
const formatDate = require("../utils/formatDate");

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

  changeUsername = async (req, res) => {
    const {username} = req.body;
    const {encryptedId} = req.token;
    const id = parseInt(decrypt(encryptedId));

    try {
      const existedUsername = await userModel.getExistingUsername(username);

      if (existedUsername) {
        if (id !== existedUsername.id) {
          res.statusCode = 409;
          return res.json({message: `${username} is already used, try another!`});
        } else {
          if (existedUsername) {
            return res.json({message: `${username} is your current username`});
          }
        }
      } else {
        userModel.updateUsername(id, username);
        return res.json({message: "success update username"});
      }
    } catch (error) {
      return res.status(500).send({message: error.message});
    }
  };

  getUserBiodata = async (req, res) => {
    const {encryptedId} = req.token;
    const id = decrypt(encryptedId);

    try {
      const userBiodata = await userModel.getUserBiodata(id);
      // auto generate new token when user login, before the previous access token expires.
      const tokenData = {
        encryptedId: encryptedId,
        username: userBiodata.User.username,
      };
      const token = jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn: "1d"});
      const manipulatedBio = {
        username: userBiodata.User.username,
        firstName: userBiodata.firstName,
        lastName: userBiodata.lastName,
        info: userBiodata.infoBio,
        address: userBiodata.address,
        birthDate: userBiodata.birthDate ? formatDate(userBiodata.birthDate) : null,
        gender: userBiodata.gender,
        profilePicture: userBiodata.profilePicture,
        email: encrypt(userBiodata.User.email),
        joinAt: userBiodata.User.createdAt,
        newToken: token,
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

  getExistingUser = async (req, res) => {
    const {username} = req.query;
    try {
      const users = await userModel.getExistingUserByUsername(username);
      if (users.length > 0) {
        const usersData = users.map((data) => ({
          username: data.username,
          profilePicture: data["User_Biodatum.profilePicture"],
        }));
        return res.json(usersData);
      } else {
        res.statusCode = 404;
        return res.json({message: `username ${username} not found!`});
      }
    } catch (error) {
      return res.status(500).send({message: error.message});
    }
  };

  getOtherUserDetailsAlsoTheirGameHistory = async (req, res) => {
    const {username} = req.params;

    try {
      const userDetails = await userModel.getOtherUserDetails(username);
      if (userDetails) {
        const roomFinished = await gameModel.getDetailFinishedRoom(userDetails.id);
        const userHistory = roomFinished.map((data) => ({
          roomId: base64EncodeURLSafe(data.id),
          roomName: data.roomName,
          result: userDetails.id === data.idPlayer1 ? data.resultPlayer1 : data.resultPlayer2,
          date: data.updatedAt,
        }));
        const manipulatedData = {
          username: userDetails.username,
          firstName: userDetails.User_Biodatum.firstName,
          lastName: userDetails.User_Biodatum.lastName,
          info: userDetails.User_Biodatum.infoBio,
          address: userDetails.User_Biodatum.address,
          birthDate: userDetails.User_Biodatum.birthDate ? formatDate(userDetails.User_Biodatum.birthDate) : null,
          gender: userDetails.User_Biodatum.gender,
          joinAt: userDetails.createdAt,
          profilePicture: userDetails.User_Biodatum.profilePicture,
          history: userHistory.length > 0 ? userHistory : "This user has no game history",
        };
        return res.json(manipulatedData);
      } else {
        res.statusCode = 404;
        return res.json({message: `user not found!`});
      }
    } catch (error) {
      return res.status(500).send({message: error.message});
    }
  };
}

module.exports = new UserController();
