const formatDate = require("../utils/formatDate");
const gameModel = require("./game.model");

class GameController {
  createNewGameRoom = async (req, res) => {
    const idPlayer1 = req.token.id;
    const {roomName, player1Choice} = req.body;

    try {
      const roomNameActive = await gameModel.findRoomNameActive(roomName);
      if (roomNameActive) {
        res.statusCode = 409;
        return res.json({message: `room with name: ${roomName} is available`});
      } else {
        gameModel.createNewRoom(idPlayer1, roomName, player1Choice);
        res.statusCode = 201;
        return res.json({message: `${roomName} room successfully created, waiting for player 2 to join and the result will be updated`});
      }
    } catch (error) {
      return res.status(500).send({message: error});
    }
  };

  getAllGameRoom = async (req, res) => {
    try {
      const allRooms = await gameModel.getAllRooms();
      const manipulatedRooms = allRooms.map((data) => ({
        roomId: data.id,
        roomName: data.roomName,
        player1: data["player1.username"],
        player2: data["player2.username"],
        roomStatus: data.roomStatus,
      }));
      return res.json(manipulatedRooms);
    } catch (error) {
      return res.status(500).send({message: error});
    }
  };

  getAvailableRoom = async (req, res) => {
    try {
      const availableRooms = await gameModel.getRoomWithStatusAvailable();
      const manipulatedRooms = availableRooms.map((data) => ({
        roomId: data.id,
        roomName: data.roomName,
        player1: data["player1.username"],
        player2: data["player2.username"],
        roomStatus: data.roomStatus,
      }));
      return res.json(manipulatedRooms);
    } catch (error) {
      return res.status(500).send({message: error});
    }
  };

  getFinishedRoom = async (req, res) => {
    try {
      const availableRooms = await gameModel.getRoomWithStatusFinish();
      const manipulatedRooms = availableRooms.map((data) => ({
        roomId: data.id,
        roomName: data.roomName,
        player1: data["player1.username"],
        player2: data["player2.username"],
        roomStatus: data.roomStatus,
      }));
      return res.json(manipulatedRooms);
    } catch (error) {
      return res.status(500).send({message: error});
    }
  };

  getGameRoomDetails = async (req, res) => {
    const {roomId} = req.params;
    try {
      const roomDetail = await gameModel.getRoomDetails(roomId);
      if (!roomDetail) {
        res.statusCode = 404;
        return res.json({message: `room with id: ${roomId} doesn't exist!`});
      } else {
        if (roomDetail.player2 === null) {
          if (req.token.id !== roomDetail.player1.id) {
            roomDetail.player1Choice = "choice is hidden";
          }
        }

        const manipulatedRoom = {
          roomId: roomDetail.id,
          roomName: roomDetail.roomName,
          player1: roomDetail.player1.username,
          player1Choice: roomDetail.player1Choice,
          player2: roomDetail.player2 === null ? null : roomDetail.player2.username,
          player2Choice: roomDetail.player2Choice,
          gameResult: null,
          roomStatus: roomDetail.roomStatus,
        };

        if (roomDetail.resultPlayer1 === "win") {
          manipulatedRoom.gameResult = `player1 is the winner`;
        } else if (roomDetail.resultPlayer1 === "lose") {
          manipulatedRoom.gameResult = `player2 is the winner`;
        } else if (roomDetail.resultPlayer1 === "draw") {
          manipulatedRoom.gameResult = `draw`;
        }

        return res.json(manipulatedRoom);
      }
    } catch (error) {
      return res.status(500).send({message: error});
    }
  };

  updateGameRoom = async (req, res) => {
    const {roomId} = req.params;
    const idPlayer2 = req.token.id;
    const {player2Choice} = req.body;
    try {
      const roomDetail = await gameModel.getRoomDetails(roomId);
      if (!roomDetail) {
        res.statusCode = 404;
        return res.json({message: `room with id: ${roomId} doesn't exist!`});
      } else {
        if (idPlayer2 === roomDetail.player1.id) {
          res.statusCode = 403;
          return res.json({message: "you cannot play against yourself!"});
        } else if (roomDetail.roomStatus === "finish") {
          res.statusCode = 403;
          return res.json({message: "the game only can be played once"});
        } else {
          const player1Choice = roomDetail.player1Choice;
          let resultPlayer1 = null;
          let resultPlayer2 = null;
          if ((player1Choice === "rock" && player2Choice === "scissors") || (player1Choice === "paper" && player2Choice === "rock") || (player1Choice === "scissors" && player2Choice === "paper")) {
            resultPlayer1 = "win";
            resultPlayer2 = "lose";
          } else if ((player1Choice === "rock" && player2Choice === "paper") || (player1Choice === "paper" && player2Choice === "scissors") || (player1Choice === "scissors" && player2Choice === "rock")) {
            resultPlayer1 = "lose";
            resultPlayer2 = "win";
          } else if ((player1Choice === "rock" && player2Choice === "rock") || (player1Choice === "paper" && player2Choice === "paper") || (player1Choice === "scissors" && player2Choice === "scissors")) {
            resultPlayer1 = "draw";
            resultPlayer2 = "draw";
          }
          // console.log(resultPlayer1);
          // console.log(resultPlayer2);
          gameModel.updateRoom(roomId, idPlayer2, player2Choice, resultPlayer1, resultPlayer2);
          const gameRecord = {
            roomName: roomDetail.roomName,
            player1Choice: roomDetail.player1Choice,
            yourChoice: player2Choice,
            result: null,
          };
          if (resultPlayer1 === "win") {
            gameRecord.result = `player 1 is the winner`;
          } else if (resultPlayer1 === "lose") {
            gameRecord.result = `player 2 is the winner`;
          } else if (resultPlayer1 === "draw") {
            gameRecord.result = `draw`;
          }
          return res.json(gameRecord);
        }
      }
    } catch (error) {
      return res.status(500).send({message: error});
    }
  };

  getGameHistory = async (req, res) => {
    const {id} = req.token;
    try {
      const roomFinished = await gameModel.getDetailFinishedRoom(id);

      const getTimeFromDate = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        // Format hours to ensure consistency in 24-hour format
        const formattedHours = (hours < 10 ? "0" : "") + hours;
        // Pad single-digit minutes with a leading zero
        const paddedMinutes = (minutes < 10 ? "0" : "") + minutes;
        return `${formattedHours}:${paddedMinutes}`;
      };

      const gameHistory = roomFinished.map((data) => ({
        roomId: data.id,
        roomName: data.roomName,
        resultGame: data.idPlayer1 === id ? data.resultPlayer1 : data.resultPlayer2,
        date: formatDate(data.updatedAt),
        time: getTimeFromDate(data.updatedAt),
      }));
      return res.json(gameHistory);
    } catch (error) {
      return res.status(500).send({message: error});
    }
  };
}

module.exports = new GameController();
