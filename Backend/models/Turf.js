const mongoose = require("mongoose");

const TurfSchema = new mongoose.Schema({
  turfId: { type: Number, required: true, unique: true },
  turfIcon: String,
  description: String,
  openTime: String,
  closeTime: String,
  full_loc: String,
  name: String,
  loc_url: String,
  area: String,
  city: String,
  type: String,
  img_f_Id: String,
  images: [String],
  playgrounds: [{
    id: { type: Number, required: true },
    sport: String,
    price: Number,
    discount: Number,
    weekend_inc: Number,
    booked_hours: { type: Number, default: 0 },
  }],
  amenities: {
    wifi: Boolean,
    cafe: Boolean,
    cctv: Boolean,
    lights: Boolean,
    parking: Boolean,
    washroom: Boolean,
  },
  open: { type: Boolean, default: true },
  owner: {
    name: String,
    contact: String,
  },
  handler: {
    name: String,
    contact: String,
  },
  fixed_slots: [{
    playgroundId: { type: Number, required: true },
    start_time: String,
    end_time: String,
    hours: Number,
    start_date: String,
    end_date: String,
  }]
}, { collection: 'turfs' });

const Turf = mongoose.model("Turf", TurfSchema);

module.exports = Turf;
