const Turf = require("../models/Turf");

const getAllTurfs = async (req, res) => {
  try {
      const turfs = await Turf.find({});
      res.json(turfs);
  } catch (err) {
      res.status(500).json({ error: 'Failed to fetch turfs' });
  }
};

const getTurfById = async (req, res) => {
  const { turfId } = req.params;

  try {
    const turf = await Turf.findOne({ turfId });
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }
    res.json(turf);
  } catch (err) {
    console.error('Error fetching turf details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllTurfs,
  getTurfById,
};
