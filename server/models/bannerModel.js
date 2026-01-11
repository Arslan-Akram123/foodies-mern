const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  image: { type: String, required: true }, // Cloudinary URL
  discountTag: { type: String }, // e.g., "50% OFF"
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);