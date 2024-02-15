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
            password: md5(password),
          },
        ],
      },
      attributes: ["id", "username"],
      raw: true,
    });
  };

  getPassword = (password) => {
    return database.User.findOne({
      where: {
        password: md5(password),
      },
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
      include: [
        {
          model: database.User,
          attributes: ["id", "username"],
        },
      ],
    });
  };

  updateBiodata = (userData, id) => {
    database.User_Biodata.update(
      {
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

  createBiodata = (userData, id) => {
    database.User_Biodata.create({
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
