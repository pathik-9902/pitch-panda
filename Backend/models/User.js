const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  username: { type: String, unique: true, required: true },
  fname: String,
  lname: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true, required: true },
  location: String,
  acStat: String,
  dob: String,
  gender: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
