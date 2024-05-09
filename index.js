const express = require("express");
const app = express();
const port = 3000;
const userRouter = require("./user/user.route");
const gameRouter = require("./user-game/game.route");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./documentation/swagger.json");
require("dotenv").config();

// CDN CSS
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {customCssUrl: CSS_URL}));
app.use("/user", userRouter);
app.use("/game", gameRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
