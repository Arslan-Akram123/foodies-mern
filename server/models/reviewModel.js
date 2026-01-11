const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  foodName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);