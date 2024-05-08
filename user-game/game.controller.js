const {base64EncodeURLSafe, base64DecodeURLSafe} = require("../utils/base64URLSafeCustom");
const {decrypt} = require("../utils/encryption");
const formatDate = require("../utils/formatDate");
const gameModel = require("./game.model");

class GameController {
  createNewGameRoom = async (req, res) => {
    const {encryptedId} = req.token;
    const idPlayer1 = decrypt(encryptedId);
    const {roomName, player1Choice} = req.body;

    try {
      const roomStatus = "available".toUpperCase();
      const roomNameActive = await gameModel.findRoomNameActive(roomName, roomStatus);
      if (roomNameActive) {
        res.statusCode = 409;
        return res.json({message: `room with name: ${roomName} is active`});
      } else {
        gameModel.createNewRoom(idPlayer1, roomName, player1Choice.toUpperCase(), roomStatus);
        res.statusCode = 201;
        return res.json({message: `${roomName} room successfully created, waiting for player 2 to join and the result will be updated`});
      }
    } catch (error) {
      return res.status(500).send({message: error.message});
    }
  };

  getAllGameRoom = async (req, res) => {
    try {
      const allRooms = await gameModel.getAllRooms();
      const manipulatedRooms = allRooms.map((data) => ({
        roomId: base64EncodeURLSafe(data.id),
        roomName: data.roomName,
        player1: data["player1.username"],
        player2: data["player2.username"],
        roomStatus: data.roomStatus,
      }));
      return res.json(manipulatedRooms);
    } catch (error) {
      return res.status(500).send({message: error.message});
    }
  };

  getAvailableRoom = async (req, res) => {
    const roomStatus = "available".toUpperCase();
    try {
      const availableRooms = await gameModel.getRoomByStatus(roomStatus);
      const manipulatedRooms = availableRooms.map((data) => ({
        roomId: base64EncodeURLSafe(data.id),
        roomName: data.roomName,
        player1: data["player1.username"],
        player2: data["player2.username"],
        roomStatus: data.roomStatus,
      }));
      return res.json(manipulatedRooms);
    } catch (error) {
      return res.status(500).send({message: error.message});
    }
  };

  getFinishedRoom = async (req, res) => {
    const roomStatus = "finish".toUpperCase();
    try {
      const finishedRooms = await gameModel.getRoomByStatus(roomStatus);
      if (finishedRooms.length > 0) {
        const manipulatedRooms = finishedRooms.map((data) => ({
          roomId: base64EncodeURLSafe(data.id),
          roomName: data.roomName,
          player1: data["player1.username"],
          player2: data["player2.username"],
          roomStatus: data.roomStatus,
        }));
        return res.json(manipulatedRooms);
      } else {
        return res.json({message: "finished room not found"});
      }
    } catch (error) {
      return res.status(500).send({message: error.message});
    }
  };

  getGameRoomDetails = async (req, res) => {
    const {encodedId} = req.params;
    const roomId = base64DecodeURLSafe(encodedId);

    try {
      const roomDetail = await gameModel.getRoomDetails(roomId);
      if (!roomDetail) {
        res.statusCode = 404;
        return res.json({message: `room with id: ${encodedId} doesn't exist!`});
      } else {
        if (roomDetail.player2 === null) {
          if (decrypt(req.token.encryptedId) !== roomDetail.player1.id.toString()) {
            roomDetail.player1Choice = "choice is hidden";
          }
        }

        const manipulatedRoom = {
          roomId: base64EncodeURLSafe(roomDetail.id),
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
      return res.status(500).send({message: error.message});
    }
  };

  updateGameRoom = async (req, res) => {
    const {encodedId} = req.params;
    const {encryptedId} = req.token;
    const roomId = base64DecodeURLSafe(encodedId);
    const idPlayer2 = decrypt(encryptedId);
    const {player2Choice} = req.body;

    try {
      const roomStatus = "finish".toUpperCase();
      const roomDetail = await gameModel.getRoomDetails(roomId);
      if (!roomDetail) {
        res.statusCode = 404;
        return res.json({message: `room with id: ${encodedId} doesn't exist!`});
      } else {
        if (roomDetail.roomStatus === roomStatus) {
          res.statusCode = 403;
          return res.json({message: "the game only can be played once"});
        } else {
          if (parseInt(idPlayer2) === roomDetail.player1.id) {
            res.statusCode = 403;
            return res.json({message: "you cannot play against yourself!"});
          } else {
            const player1Choice = roomDetail.player1Choice.toLowerCase();
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
            gameModel.updateRoom(roomId, idPlayer2, player2Choice.toUpperCase(), resultPlayer1.toUpperCase(), resultPlayer2.toUpperCase(), roomStatus);
            const gameRecord = {
              roomName: roomDetail.roomName,
              player1Choice: roomDetail.player1Choice,
              yourChoice: player2Choice.toUpperCase(),
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
      }
    } catch (error) {
      return res.status(500).send({message: error.message});
    }
  };

  getGameHistory = async (req, res) => {
    const {encryptedId} = req.token;
    const id = decrypt(encryptedId);
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
        roomId: base64EncodeURLSafe(data.id),
        roomName: data.roomName,
        resultGame: data.idPlayer1 === id ? data.resultPlayer1 : data.resultPlayer2,
        date: formatDate(data.updatedAt),
        time: getTimeFromDate(data.updatedAt),
      }));
      return res.json(gameHistory);
    } catch (error) {
      return res.status(500).send({message: error.message});
    }
  };
}

module.exports = new GameController();
