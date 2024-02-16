const express = require("express");
const app = express();
const userRouter = require("./user/user.route");
const gameRouter = require("./user-game/game.route");
const port = 3000;

require("dotenv").config();

app.use(express.json());
app.use("/user", userRouter);
app.use("/game", gameRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
