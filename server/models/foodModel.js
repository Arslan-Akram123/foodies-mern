const mongoose = require('mongoose');

const foodSchema = mongoose.Schema({
  name: { type: String, required: [true, 'Food name is required'] },
  description: { type: String, required: [true, 'Description is required'] },
  price: { type: Number, required: [true, 'Price is required'] },
  image: { type: String, required: [true, 'Image is required'] },
  category: { type: String, required: [true, 'Category is required'] }, // Matches category name
  status: { type: String, enum: ['Available', 'Out of Stock'], default: 'Available' },
  rating: { type: Number, default: 4.5 },
  numReviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);