const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const splitSlotSchema = new Schema({
  slotId: { type: String, required: true },
  turfId: { type: Number, required: true }, 
  playgroundId: { type: Number, required: true },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  userId: { type: String, required: true },
  status: {
    type: String,
    enum: ['Booking', 'Booked', 'Cancelled', 'Attempted'],
    default: 'Booking', 
    required: true,
  },
}, { collection: 'splitedslot' }); // Specify collection name 'splitedslot'

const SplitedSlot = mongoose.model("SplitedSlot", splitSlotSchema);

module.exports = SplitedSlot;
