const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  totalPlaytime: { type: Number, default: 0 },
  pgCoins: { type: Number, default: 0 },
});

const Player = mongoose.model("Player", playerSchema);

module.exports = Player;
