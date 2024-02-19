const md5 = require("md5");
const database = require("../db/models");
const {Op} = require("sequelize");

class UserModel {
  getExistingUsername = (username) => {
    return database.User.findOne({
      where: {username: username.toLowerCase()},
      attributes: ["username"],
      raw: true,
    });
  };

  getExistingEmail = (email) => {
    return database.User.findOne({
      where: {email: email.toLowerCase()},
      attributes: ["email"],
      raw: true,
    });
  };

  registerNewUser = (username, email, password) => {
    database.User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: md5(password),
    });
  };

  getRegisteredUser = (email, password) => {
    return database.User.findOne({
      where: {
        [Op.and]: [
          {
            email: email,
          },
          {
            password: md5(password),
          },
        ],
      },
      attributes: ["id", "username"],
      raw: true,
    });
  };

  getUserById = (id) => {
    return database.User.findOne({
      where: {id},
      attributes: {
        exclude: ["password", "updatedAt"],
      },
    });
  };

  getUserBiodata = (id) => {
    return database.User_Biodata.findOne({
      where: {userId: id},
      attributes: {
        exclude: ["id", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: database.User,
          attributes: ["username", "createdAt"],
        },
      ],
    });
  };

  updateBiodata = (id, userData) => {
    database.User_Biodata.update(
      {
        birthDate: userData.birthDate,
        firstName: userData.firstName,
        lastName: userData.lastName,
        infoBio: userData.infoBio,
        address: userData.address,
        gender: userData.gender,
      },
      {
        where: {userId: id},
      }
    );
  };

  createBiodata = (id, userData) => {
    database.User_Biodata.create({
      birthDate: userData.birthDate,
      firstName: userData.firstName,
      lastName: userData.lastName,
      infoBio: userData.infoBio,
      address: userData.address,
      gender: userData.gender,
      userId: id,
    });
  };
}

module.exports = new UserModel();
