const express = require("express");
const jwt = require("jsonwebtoken");
const { getDb } = require("../db");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  const db = getDb();
  const { name, email, password } = req.body;
  const existing = await db.collection("users").findOne({ email });
  if (existing) return res.status(400).json({ error: "User exists" });

  await db.collection("users").insertOne({ name, email, password });
  res.status(201).json({ message: "User registered" });
});


// Login
router.post("/login", async (req, res) => {
  const db = getDb();
  const { email, password } = req.body;
  const user = await db.collection("users").findOne({ email });

  if (!user || user.password !== password)
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({ token });
});

module.exports = router;
