const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Player = require("../models/Player");
const generateUserId = require("../utils/generateUserId");

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'mysecretkey';

router.post("/updateCity/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { location } = req.body;

  try {
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.location = location;
    await user.save();

    res.json({ success: true, message: "City updated successfully", user });
  } catch (error) {
    console.error('Error updating city:', error);
    res.status(500).json({ success: false, message: "Failed to update city" });
  }
});

router.post('/login', async (req, res) => {
  const { phone } = req.body;

  try {
    // Check if user exists by phone number
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Generate JWT token
    const token = jwt.sign({ id: user._id, fname: user.fname }, SECRET_KEY, { expiresIn: '1h' });
    res.send({ message: "Login successful", token: token, user: user });

    // Update user's account status to active (if needed)
    user.acStat = 'active';
    await user.save();
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/signup', async (req, res) => {
  const { username, fname, lname, email, acStat, phone, dob, gender } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      const errors = {};
      if (existingUser.username === username) {
        errors.username = 'Username is already taken';
      }
      if (existingUser.email === email) {
        errors.email = 'Email is already registered';
      }
      return res.status(400).send({ message: 'User already exists', errors });
    }
    const userId = await generateUserId();
    const newUser = new User({
      userId, username, fname, lname, email, acStat, phone, dob, gender,
    });
    await newUser.save();

    // Assuming Player model is defined similarly
    const newPlayer = new Player({
      userId,
      pgCoins: 100,
    });
    await newPlayer.save();

    res.status(201).send({ message: 'Account has been created!! Please Login' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
});


// Deactivate user account endpoint
router.post('/deactivate', async (req, res) => {
  const { userId } = req.body;
  const user = await User.findOne({ userId });
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  user.acStat = "inactive";
  await user.save();
  res.send({ message: "Account has been deactivated" });
});

// Update profile endpoint
router.post("/updateProfile", async (req, res) => {
  const { userId, fname, lname, email, dob, gender } = req.body;
  const updateFields = { fname, lname, email, dob, gender };

  try {
    const user = await User.findOneAndUpdate(
      { userId },
      { $set: updateFields },
      { new: true }
    );
  
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
  
    res.send({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send({ message: "Failed to update profile" });
  }
});

module.exports = router;