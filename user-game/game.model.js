const {Op} = require("sequelize");
const database = require("../db/models");

class GameModel {
  createNewRoom = (idPlayer1, roomName, player1Choice, roomStatus) => {
    database.Game_Room.create({
      roomName,
      idPlayer1,
      player1Choice,
      roomStatus,
    });
  };

  findRoomNameActive = (roomName, roomStatus) => {
    return database.Game_Room.findOne({
      where: {
        roomName,
        roomStatus,
      },
    });
  };

  getAllRooms = () => {
    return database.Game_Room.findAll({
      attributes: ["id", "roomName", "roomStatus"],
      include: [
        {
          model: database.User,
          as: "player1",
          attributes: ["username"],
        },
        {
          model: database.User,
          as: "player2",
          attributes: ["username"],
        },
      ],
      order: [["id", "DESC"]],
      raw: true,
    });
  };

  getRoomByStatus = (roomStatus) => {
    return database.Game_Room.findAll({
      where: {roomStatus},
      attributes: ["id", "roomName", "roomStatus"],
      include: [
        {
          model: database.User,
          as: "player1",
          attributes: ["username"],
        },
        {
          model: database.User,
          as: "player2",
          attributes: ["username"],
        },
      ],
      order: [["id", "DESC"]],
      raw: true,
    });
  };

  getRoomDetails = (roomId) => {
    return database.Game_Room.findOne({
      where: {id: roomId},
      attributes: ["id", "roomName", "player1Choice", "resultPlayer1", "player2Choice", "resultPlayer2", "roomStatus"],
      include: [
        {
          model: database.User,
          as: "player1",
          attributes: ["id", "username"],
        },
        {
          model: database.User,
          as: "player2",
          attributes: ["id", "username"],
        },
      ],
      // raw: true,
    });
  };

  updateRoom = (roomId, idPlayer2, player2Choice, resultPlayer1, resultPlayer2, roomStatus) => {
    database.Game_Room.update(
      {
        idPlayer2,
        player2Choice,
        resultPlayer1,
        resultPlayer2,
        roomStatus,
      },
      {
        where: {id: roomId},
      }
    );
  };

  getDetailFinishedRoom = (id) => {
    return database.Game_Room.findAll({
      where: {
        [Op.or]: [{idPlayer1: id}, {idPlayer2: id}],
        roomStatus: "finish".toUpperCase(),
      },
      order: [["updatedAt", "DESC"]],
    });
  };
}

module.exports = new GameModel();
