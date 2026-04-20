const express = require("express");
const Player = require("../models/Player");

const router = express.Router();

// PG coins endpoint + -
router.post('/pgcoins/:userId', async (req, res) => {
  const { userId } = req.params;
  const { action, amount } = req.body;

  try {
    const player = await Player.findOne({ userId });
    if (!player) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (action === 'add') {
      player.pgCoins += amount;
    } else if (action === 'subtract') {
      if (player.pgCoins < amount) {
        return res.status(400).json({ message: 'Not enough PG coins' });
      }
      player.pgCoins -= amount;
    } else if (action === 'fetch') {
      return res.json({ pgCoins: player.pgCoins });
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await player.save();
    res.json({ message: 'Operation successful', newPgCoins: player.pgCoins });
  } catch (err) {
    res.status(500).json({ message: 'Error performing operation on PG coins' });
  }
});

module.exports = router;
