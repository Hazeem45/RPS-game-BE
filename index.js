const express = require('express');
const app = express();
const port = 3000;
const userRouter = require('./user/user.route');
const gameRouter = require('./user-game/game.route');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./documentation/swagger.json');
const options = require('./utils/customSwagger');
require('dotenv').config();

app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);
app.options('*', cors());

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
app.use('/user', userRouter);
app.use('/game', gameRouter);
app.get('/', (req, res) => {
  res.send('Hello There! add "/api-docs" in url to open the API Documentation or just Visit the Source Code 👉 https://github.com/Hazeem45/RPS-game-BE');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
