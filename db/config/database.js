require("dotenv").config();
const pg = require("pg");

module.exports = {
  development: {
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
