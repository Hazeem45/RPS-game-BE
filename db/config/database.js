require("dotenv").config();
const pg = require("pg");

module.exports = {
  development: {
    url: "postgresql://rps_game:hazeemrpsgame@localhost:5432/rps_game",
    dialect: "postgres",
    dialectModules: pg,
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    dialectModules: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: process.env.CA_CERT,
      },
    },
  },
};
