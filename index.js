const express = require("express");
const app = express();
const userRouter = require("./user/user.route");
const port = 3000;

require("dotenv").config();

app.use(express.json());
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
