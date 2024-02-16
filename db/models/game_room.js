"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Game_Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Game_Room.belongsTo(models.User, {
        foreignKey: "idPlayer1",
        as: "player1",
      });
      Game_Room.belongsTo(models.User, {
        foreignKey: "idPlayer2",
        as: "player2",
      });
    }
  }
  Game_Room.init(
    {
      roomName: DataTypes.STRING,
      idPlayer1: DataTypes.INTEGER,
      player1Choice: DataTypes.STRING,
      resultPlayer1: DataTypes.STRING,
      idPlayer2: DataTypes.INTEGER,
      player2Choice: DataTypes.STRING,
      resultPlayer2: DataTypes.STRING,
      roomStatus: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Game_Room",
    }
  );
  return Game_Room;
};
