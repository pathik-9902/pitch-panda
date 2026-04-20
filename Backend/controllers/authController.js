const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Player = require("../models/Player");
const generateUserId = require("../utils/generateUserId");

const SECRET_KEY = process.env.SECRET_KEY || 'mysecretkey';

const login = async (req, res) => {
  const { login, password } = req.body;
  const user = await User.findOne({
    $or: [{ email: login }, { username: login }]
  });
  if (!user) {
    return res.status(401).send({ message: "Invalid username/email or password" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).send({ message: "Invalid username/email or password" });
  }

  const token = jwt.sign({ id: user._id, fname: user.fname }, SECRET_KEY, { expiresIn: "1h" });
  res.send({ message: "Login successful", token: token, user: user });

  user.acStat = "active";
  await user.save();
};

const signup = async (req, res) => {
  const { username, fname, lname, email, password, acStat } = req.body;

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res.status(400).send({ message: "User registration failed" });
  }

  const existingUsername = await User.findOne({ username: username });
  if (existingUsername) {
    return res.status(400).send({ message: "User registration failed" });
  }

  const userId = await generateUserId();
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    userId,
    username,
    fname,
    lname,
    email,
    password: hashedPassword,
    acStat,
  });

  await newUser.save();

  const newPlayer = new Player({
    userId,
    pgCoins: 100
  });

  await newPlayer.save();

  res.status(201).send({ message: "Account has been created!! Please Login" });
};

const deactivate = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findOne({ userId });
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  user.acStat = "inactive";
  await user.save();
  res.send({ message: "Account has been deactivated" });
};

const updateProfile = async (req, res) => {
  const { userId, fname, lname, email } = req.body;
  const user = await User.findOneAndUpdate(
    { userId },
    { $set: { fname, lname, email } },
    { new: true }
  );
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  res.send({ success: true, message: "Profile updated successfully" });
};

const changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  const user = await User.findOne({ userId });
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatch) {
    return res.status(401).send({ message: "Current password is incorrect" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  res.send({ success: true, message: "Password changed successfully" });
};

module.exports = {
  login,
  signup,
  deactivate,
  updateProfile,
  changePassword,
};
