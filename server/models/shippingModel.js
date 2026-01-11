const mongoose = require('mongoose');

const shippingSchema = mongoose.Schema({
  type: { type: String, enum: ['free', 'standard', 'custom'], default: 'standard' },
  standardPrice: { type: Number, default: 250 },
  customPrice: { type: Number, default: 0 },
  thresholdEnabled: { type: Boolean, default: true },
  thresholdAmount: { type: Number, default: 2000 }
}, { timestamps: true });

module.exports = mongoose.model('Shipping', shippingSchema);