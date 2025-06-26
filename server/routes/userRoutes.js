/**
 * @module userRoutes
 * @description Express router for user authentication and registration.
 * Handles user registration and login, including password hashing and booking link generation.
 */

const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

/**
 * @route POST /register
 * @description Registers a new user with a unique booking link.
 * Validates input, checks for existing username, hashes password, and saves user to the database.
 *
 * @param {string} user_name - The username for registration.
 * @param {string} password - The password for registration.
 * @returns {Object} The created user's id, username, and booking link.
 */
router.post("/register", async (req, res) => {
  const { user_name, password } = req.body;
  if (!user_name || !password)
    return res.status(400).json({ message: "All fields required" });

  const existing = await Users.findOne({ where: { user_name } });
  if (existing)
    return res.status(400).json({ message: "user_name already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const bookingLink = uuidv4();

  const user = await Users.create({
    user_name,
    password: hashedPassword,
    bookingLink,
  });
  res.json({ user_id: user.user_id, user_name: user.user_name, bookingLink });
});

/**
 * @route POST /login
 * @description Authenticates a user by username and password.
 * Checks credentials and returns user info and booking link if valid.
 *
 * @param {string} user_name - The username for login.
 * @param {string} password - The password for login.
 * @returns {Object} The user's id, username, and booking link if credentials are valid.
 */
router.post("/login", async (req, res) => {
  const { user_name, password } = req.body;
  const user = await Users.findOne({ where: { user_name } });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    user_id: user.user_id,
    user_name: user.user_name,
    bookingLink: user.bookingLink,
  });
});

module.exports = router;
