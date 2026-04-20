const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slotSchema = new Schema({
  slotId: { type: String, required: true },
  turfId: { type: Number, required: true }, 
  playgroundId: { type: Number, required: true },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  numOfHours: { type: Number, required: true },
  userId: { type: String, required: true },
  bookedBy: { type: String, required: true },
  status: {
    type: String,
    enum: ['Booking', 'Booked', 'Cancelled', 'Attempted'],
    default: 'Booking', 
    required: true,
  },
  payment: {
    amountPaid: { type: Number, required: true },
    amountToBePaid: { type: Number, required: true },
  },
});

const Slot = mongoose.model("Slot", slotSchema);

module.exports = Slot;
