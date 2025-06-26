require("dotenv").config();

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    dialectOptions: {
      connectTimeout: 220000000,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 220000000,
      idle: 10000000,
    },
    logging: console.log,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("DB Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
