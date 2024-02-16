const express = require("express");
const authorization = require("../middleware/authorization");
const gameController = require("./game.controller");
const gameRouter = express();

gameRouter.post("/new-room", authorization, gameController.createNewGameRoom);
gameRouter.get("/all-rooms", authorization, gameController.getAllGameRoom);
gameRouter.get("/available-rooms", authorization, gameController.getAvailableRoom);
gameRouter.get("/finished-rooms", authorization, gameController.getFinishedRoom);
gameRouter.get("/room/:roomId", authorization, gameController.getGameRoomDetails);
gameRouter.put("/room/:roomId", authorization, gameController.updateGameRoom);
gameRouter.get("/history", authorization, gameController.getGameHistory);

module.exports = gameRouter;
