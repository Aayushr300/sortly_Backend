const express = require("express");
const { registerUser } = require("../services/auth.service");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findUserByEmail } = require("../dao/user.dao");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const user = await findUserByEmail(email); // should return { id, email, password, ... }
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // ✅ 3. Create JWT token with correct MySQL-style ID
    const token = jwt.sign({ id: user.id }, process.env.JWT_TOKEN, {
      expiresIn: "1d",
    });

    // 4. Send response
    res.status(200).json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.register = async (req, res) => {
  try {
    // Safely destructure with default empty object
    const { name, email, password } = req.body || {};

    // Validate input
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    // Call your existing registration service
    const user = await registerUser(name, email, password);

    // Respond with success
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Register Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
