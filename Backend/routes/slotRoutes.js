const express = require("express");
const Slot = require("../models/Slot");
const SplitedSlot = require("../models/SplitedSlot");
const router = express.Router();

router.get('/book/:turfId/:playgroundId', async (req, res) => {
  const { turfId, playgroundId } = req.params;
  try {
    const turfBookings = await Slot.find({ turfId, playgroundId }).sort({ slotDate: -1 });
    res.json(turfBookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).send({ message: 'An error occurred while fetching bookings.' });
  }
});

router.post('/bookSlot', async (req, res) => {
  const { turfId, playgroundId, slotDate, slotTime, numOfHours, userId, bookedBy, amountPaid, amountToBePaid } = req.body;

  if (!turfId || !playgroundId || !slotDate || !slotTime || !numOfHours || !userId || !bookedBy || amountPaid == null || amountToBePaid == null) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const status = 'Booked';
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
  const newSlot = new Slot({ slotId, turfId, playgroundId, slotDate, slotTime, numOfHours, userId, bookedBy, status, payment: { amountPaid, amountToBePaid } });

  try {
    await newSlot.save();
    res.status(201).send({ message: 'Slot created successfully' })
    splitSlotById(slotId)
  } catch (err) {
    console.error('Error creating slot:', err);
    res.status(500).send({ message: 'An error occurred while creating the slot. Please try again.' });
  }
});


router.get('/fetchByUser/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const userSlots = await Slot.find({ userId });
    res.json(userSlots);
  } catch (err) {
    console.error('Error fetching user slots:', err);
    res.status(500).json({ message: 'An error occurred while fetching user slots' });
  }
});


// Update slot status to 'deleted' by slotId
router.put('/cancel/:slotId', async (req, res) => {
  const { slotId } = req.params;

  try {
    const updatedSlot = await Slot.findOneAndUpdate(
      { slotId },
      { $set: { status: 'Cancelled' } },
      { new: true }
    );

    if (!updatedSlot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    res.json({ message: 'Slot cancellation successful', slot: updatedSlot });
  } catch (err) {
    console.error('Error cancelling slot:', err);
    res.status(500).json({ message: 'An error occurred while cancelling the slot' });
  }
});




// Function to split a specific slot by slotId
const splitSlotById = async (slotId) => {
  try {
    const slot = await Slot.findOne({ slotId });

    if (!slot) {
      throw new Error(`Slot with slotId ${slotId} not found.`);
    }

    let currentSlotTime = slot.slotTime;
    let remainingHours = slot.numOfHours;
    let currentDate = slot.slotDate;

    while (remainingHours > 0) {
      const slotIdSuffix = `_${slot.numOfHours - remainingHours + 1}`;
      const numOfHoursInThisSlot = remainingHours > 1 ? 1 : remainingHours;

      const splitedSlot = new SplitedSlot({
        userId: slot.userId,
        slotId: slot.slotId + slotIdSuffix,
        turfId: slot.turfId,
        playgroundId: slot.playgroundId,
        slotDate: currentDate,
        slotTime: currentSlotTime,
        status: "Booked",
        // Add payment details if needed
      });

      await splitedSlot.save();

      // Increment current slot time and remaining hours
      currentSlotTime = incrementSlotTime(currentSlotTime);
      remainingHours -= numOfHoursInThisSlot;

      // Handle date increment if time crosses midnight
      if (currentSlotTime === "00:00") {
        currentDate = incrementDate(currentDate);
      }
    }
  } catch (error) {
    console.error(`Error splitting slot ${slotId}:`, error);
    throw error; // Propagate the error to be handled by the route handler
  }
};



// Function to increment slot time by one hour
function incrementSlotTime(slotTime) {
  const [hours, minutes] = slotTime.split(":").map(Number);
  let newHours = hours + 1;
  if (newHours >= 24) {
    newHours -= 24;
  }
  return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Function to increment date by one day
function incrementDate(dateString) {
  let [day, month, year] = dateString.split('-').map(Number);
  day++;

  if (day > daysInMonth(month, year)) {
    day = 1;
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }

  return `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
}

// Helper function to determine days in a month
function daysInMonth(month, year) {
  switch (month) {
    case 1: case 3: case 5: case 7: case 8: case 10: case 12:
      return 31;
    case 4: case 6: case 9: case 11:
      return 30;
    case 2:
      return isLeapYear(year) ? 29 : 28;
    default:
      return 31;
  }
}

// Helper function to determine if a year is leap year
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

module.exports = router;
