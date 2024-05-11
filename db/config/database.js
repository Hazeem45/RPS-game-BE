require("dotenv").config();
const fs = require("fs");

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false,
        // ca: fs.readFileSync("./ca.pem").toString(),
      },
    },
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false,
        // ca: fs.readFileSync("./ca.pem").toString(),
      },
    },
  },
};
