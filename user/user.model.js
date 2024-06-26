const md5 = require('md5');
const database = require('../db/models');
const { Op } = require('sequelize');

class UserModel {
  getExistingUsername = (username) => {
    return database.User.findOne({
      where: { username: username.toLowerCase() },
      attributes: ['id', 'username'],
      raw: true,
    });
  };

  getExistingEmail = (email) => {
    return database.User.findOne({
      where: { email: email.toLowerCase() },
      attributes: ['email'],
      raw: true,
    });
  };

  registerNewUser = (username, email, password) => {
    return database.User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: md5(password),
    });
  };

  createBiodata = (id) => {
    database.User_Biodata.create({
      userId: id,
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
      attributes: ['id', 'username'],
      raw: true,
    });
  };

  updateUsername = (id, username) => {
    database.User.update(
      {
        username: username.toLowerCase(),
      },
      {
        where: { id },
      },
    );
  };

  getUserBiodata = (id) => {
    return database.User_Biodata.findOne({
      where: { userId: id },
      attributes: {
        exclude: ['id', 'userId', 'createdAt', 'updatedAt'],
      },
      include: [
        {
          model: database.User,
          attributes: ['username', 'email', 'createdAt'],
        },
      ],
    });
  };

  updateBiodata = (id, userData) => {
    database.User_Biodata.update(
      {
        profilePicture: userData.profilePicture,
        birthDate: userData.birthDate,
        firstName: userData.firstName,
        lastName: userData.lastName,
        infoBio: userData.infoBio,
        address: userData.address,
        gender: userData.gender,
      },
      {
        where: { userId: id },
      },
    );
  };

  getExistingUserByUsername = (username) => {
    return database.User.findAll({
      where: {
        username: {
          [Op.like]: `%${username}%`,
        },
      },
      attributes: {
        exclude: ['id', 'email', 'password', 'createdAt', 'updatedAt'],
      },
      include: [
        {
          model: database.User_Biodata,
          attributes: ['profilePicture'],
        },
      ],
      raw: true,
    });
  };

  getOtherUserDetails = (username) => {
    return database.User.findOne({
      where: { username: username },
      attributes: ['id', 'username', 'createdAt'],
      include: [
        {
          model: database.User_Biodata,
          attributes: {
            exclude: ['id', 'userId', 'createdAt', 'updatedAt'],
          },
        },
      ],
    });
  };
}

module.exports = new UserModel();
