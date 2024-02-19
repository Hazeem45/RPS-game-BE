const express = require("express");
const gameController = require("./game.controller");
const authorization = require("../middleware/authorization");
const validation = require("../middleware/validation");
const {newRoomSchema, updateRoomSchema} = require("../utils/checkSchema");
const gameRouter = express();

gameRouter.post("/new-room", newRoomSchema(), validation, authorization, gameController.createNewGameRoom);
gameRouter.get("/all-rooms", authorization, gameController.getAllGameRoom);
gameRouter.get("/available-rooms", authorization, gameController.getAvailableRoom);
gameRouter.get("/finished-rooms", authorization, gameController.getFinishedRoom);
gameRouter.get("/room/:roomId", authorization, gameController.getGameRoomDetails);
gameRouter.put("/room/:roomId", updateRoomSchema(), validation, authorization, gameController.updateGameRoom);
gameRouter.get("/history", authorization, gameController.getGameHistory);

module.exports = gameRouter;
