require("dotenv").config();
const pg = require("pg");

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false,
        // ca: process.env.CA_CERT,
      },
    },
    dialectModule: pg,
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false,
        // ca: process.env.CA_CERT,
      },
    },
    dialectModule: pg,
  },
};
