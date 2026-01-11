const express = require('express');
const router = express.Router();
const cloudinary = require('../utils/cloudinary');
const multer = require('multer'); // Standard import
const { protect, admin } = require('../middleware/authMiddleware');

// Correct initialization for memory storage
const storage = multer.memoryStorage(); 
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert buffer to base64 for Cloudinary
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'foodies_uploads',
    });
      
    res.json({ url: uploadResponse.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

module.exports = router;