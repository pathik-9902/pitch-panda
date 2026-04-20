const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const Turf = require('../models/Turf');

// Upload multiple images for a turf
router.post('/upload/:turfId', upload.array('images', 10), async (req, res) => {
  try {
    const { turfId } = req.params;
    const imageUrls = req.files.map(file => file.path);

    const turf = await Turf.findOneAndUpdate(
      { turfId: parseInt(turfId) },
      { $push: { images: { $each: imageUrls } } },
      { new: true }
    );

    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    res.status(200).json({ message: 'Images uploaded successfully', images: turf.images });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload images' });
  }
});

// Get images for a turf
router.get('/:turfId', async (req, res) => {
  try {
    const { turfId } = req.params;
    const turf = await Turf.findOne({ turfId: parseInt(turfId) });

    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    res.status(200).json(turf.images || []);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch images' });
  }
});

module.exports = router;
