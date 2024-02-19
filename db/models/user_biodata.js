"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_Biodata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User_Biodata.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  User_Biodata.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      infoBio: DataTypes.STRING,
      address: DataTypes.STRING,
      gender: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      birthDate: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User_Biodata",
    }
  );
  return User_Biodata;
};
