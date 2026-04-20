const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  turfId: { type: Number, required: true }, 
  value: { type: Number, default: 0 },
  comment: String,
});

const Rating = mongoose.model('Rating', RatingSchema);

module.exports = Rating;
