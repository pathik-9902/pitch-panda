const express = require("express");
const SplitedSlot = require("../models/SplitedSlot");

const router = express.Router();


router.get('/fetch/:turfId', async (req, res) => {
  const { turfId } = req.params;
  try {
    const slots = await SplitedSlot.find({ turfId, status: 'Booked' });
    res.json(slots);
  } catch (err) {
    console.error('Error fetching slots:', err);
    res.status(500).json({ message: 'An error occurred while fetching slots' });
  }
});

// Endpoint to fetch slots by date
router.get('/fetch/:turfId/:date', async (req, res) => {
  try {
    const { turfId, date } = req.params;
    const slots = await SplitedSlot.find({ turfId, slotDate: date,status: 'Booked' });
    res.json(slots);
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

module.exports = router;
