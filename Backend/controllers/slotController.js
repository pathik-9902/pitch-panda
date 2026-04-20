const Slot = require("../models/Slot");

const getBookings = async (req, res) => {
  const { turfId, playgroundId } = req.params;
  try {
    const turfBookings = await Slot.find({ turfId, playgroundId }).sort({ slotDate: -1 });
    res.json(turfBookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).send({ message: 'An error occurred while fetching bookings.' });
  }
};

const bookSlot = async (req, res) => {
  const { turfId, playgroundId, slotDate, slotTime, numOfHours, userId, bookedBy } = req.body;

  if (!turfId || !playgroundId || !slotDate || !slotTime || !numOfHours || !userId || !bookedBy) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const currentDate = new Date();
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');
  const userstime = hours + minutes + seconds;

  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear().toString().slice(-2);
  const userdate = day + month + year;

  const slotId = `T${turfId}P${playgroundId}${userId}D${userdate}S${userstime}`;
  const newSlot = new Slot({ slotId, turfId, playgroundId, slotDate, slotTime, numOfHours, userId, bookedBy });

  try {
    await newSlot.save();
    res.status(201).send({ message: 'Slot created successfully' });
  } catch (err) {
    console.error('Error creating slot:', err);
    res.status(500).send({ message: 'An error occurred while creating the slot. Please try again.' });
  }
};

const getSlotsByTurf = async (req, res) => {
  const { turfId } = req.params;

  try {
    const slots = await Slot.find({ turfId });
    res.json(slots);
  } catch (err) {
    console.error('Error fetching slots:', err);
    res.status(500).json({ message: 'An error occurred while fetching slots' });
  }
};

const getSlotsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const slots = await Slot.find({ userId });
    if (!slots || slots.length === 0) {
      return res.status(404).json({ message: 'No slots found for the specified user.' });
    }
    res.json(slots);
  } catch (err) {
    console.error('Error fetching slots:', err);
    res.status(500).json({ message: 'An error occurred while fetching slots' });
  }
};

module.exports = {
  getBookings,
  bookSlot,
  getSlotsByTurf,
  getSlotsByUser,
};
