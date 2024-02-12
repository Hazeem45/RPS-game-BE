const md5 = require("md5");
const database = require("../db/models");
const {Op} = require("sequelize");

class UserModel {
  getExistingUsername = (username) => {
    return database.User.findOne({
      where: {username},
    });
  };

  getExistingEmail = (email) => {
    return database.User.findOne({
      where: {email},
    });
  };

  registerNewUser = (username, email, password) => {
    database.User.create({
      username,
      email,
      password: md5(password),
    });
  };

  getRegisteredUser = (email, password) => {
    return database.User.findOne({
      where: {
        [Op.and]: [
          {
            email,
          },
          {
            password,
          },
        ],
      },
      raw: true,
    });
  };

  getPassword = (password) => {
    return database.User.findOne({
      where: {password},
    });
  };
}

module.exports = new UserModel();
