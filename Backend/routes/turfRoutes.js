const express = require("express");
const Turf = require("../models/Turf");

const router = express.Router();


router.post('/updateOpenStatus', async (req, res) => {
  const { turfId, open } = req.body;
  try {
    const updatedTurf = await Turf.findOneAndUpdate(
      { turfId: turfId },
      { $set: { open: open } },
      { new: true }
    );
    if (!updatedTurf) {
      return res.status(404).json({ success: false, message: 'Turf not found' });
    }
    return res.status(200).json({ success: true, message: 'Turf open status updated successfully' });
  } catch (error) {
    console.error('Error updating turf open status:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Fetch all turfs
router.get('/', async (req, res) => {
  try {
      const turfs = await Turf.find({});
      res.json(turfs);
  } catch (err) {
      res.status(500).json({ error: 'Failed to fetch turfs' });
  }
});

// Fetch turfs by city
router.get('/byCity/:city', async (req, res) => {
  const { city } = req.params;
  const cityName = city.split(',')[0].trim();
  try {
    const turfs = await Turf.find({ city: new RegExp(`^${cityName}$`, 'i') });
    res.json(turfs);
  } catch (err) {
    console.error('Error fetching turfs by city:', err);
    res.status(500).json({ error: 'Failed to fetch turfs by city' });
  }
});

// Fetch turf details by turfId
router.get('/:turfId', async (req, res) => {
  const { turfId } = req.params;

  try {
    const turf = await Turf.findOne({ turfId }); // Assuming turfId is a unique identifier in your Turf model
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }
    res.json(turf);
  } catch (err) {
    console.error('Error fetching turf details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to update booked hours after successful booking
router.post('/bookedHours', async (req, res) => {
  const { turfId, playgroundId, numOfHours } = req.body;

  try {
    // Find the Turf by turfId
    const turf = await Turf.findOne({ turfId });

    if (!turf) {
      return res.status(404).json({ error: 'Turf not found' });
    }

    // Find the playground by playgroundId
    const playground = turf.playgrounds.find(pg => pg.id === playgroundId);

    if (!playground) {
      return res.status(404).json({ error: 'Playground not found' });
    }

    // Update booked_hours for the playground
    playground.booked_hours += numOfHours;

    // Save the updated Turf document
    await turf.save();

    res.json({ message: 'Booked hours updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
