const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: 'Admin' },
  image: { type: String, required: true }, // Cloudinary URL
  category: { type: String, default: 'Food Trends' }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);