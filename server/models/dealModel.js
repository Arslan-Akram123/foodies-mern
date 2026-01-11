const mongoose = require('mongoose');

const dealSchema = mongoose.Schema({
  name: { type: String, required: true },
  items: { type: String, required: true }, // List of items in combo
  originalPrice: { type: Number },
  dealPrice: { type: Number, required: true },
  image: { type: String, required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Deal', dealSchema);