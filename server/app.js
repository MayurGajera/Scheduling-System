/**
 * @module app
 * @description Main Express application setup.
 * Configures middleware, routes, and database synchronization for the scheduling system server.
 */

const express = require("express");
const cors = require("cors");
const db = require("./models");

const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());

/**
 * @route /api/users
 * @description Mounts user authentication and registration routes.
 */
app.use("/api/users", userRoutes);

/**
 * @function db.sequelize.sync
 * @description Synchronizes Sequelize models with the database.
 */
db.sequelize.sync();

module.exports = app;
