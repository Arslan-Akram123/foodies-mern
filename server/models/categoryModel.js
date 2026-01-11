const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: { type: String, required: [true, 'Category name is required'], unique: true },
  image: { type: String, required: [true, 'Category image is required'] }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);