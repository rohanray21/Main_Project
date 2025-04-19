const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Assuming your User model is here

const router = express.Router();

// POST /api/users/register - User Registration
router.post("/register", async (req, res) => {
  console.log("Received a request for /register route");  // Add this line here

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: savedUser });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error, please try again" });
  }
});

module.exports = router;
