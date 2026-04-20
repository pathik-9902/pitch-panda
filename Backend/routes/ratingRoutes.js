const express = require("express");
const Rating = require("../models/Rating"); // Assuming Rating model is defined elsewhere

const router = express.Router();

router.post('/', async (req, res) => {
  const { turfId, value, comment } = req.body;

  // Validate inputs
  if (!turfId || isNaN(parseFloat(value)) || value < 0 || value > 5) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  try {
    const newRating = new Rating({
      turfId,
      value,
      comment,
    });

    await newRating.save();

    res.status(200).json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Error rating turf:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/average/:turfId', async (req, res) => {
  const { turfId } = req.params;

  try {
    // Find all ratings for the given turfId
    const ratings = await Rating.find({ turfId: parseInt(turfId) });

    // Check if no ratings found
    if (ratings.length === 0) {
      return res.json({ average: 0, count: 0 });
    }

    // Calculate average rating
    const totalSum = ratings.reduce((acc, rating) => acc + rating.value, 0);
    const average = totalSum / ratings.length;

    // Respond with average rating and count of ratings
    res.json({ average, count: ratings.length });
  } catch (err) {
    console.error('Error fetching average rating:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
