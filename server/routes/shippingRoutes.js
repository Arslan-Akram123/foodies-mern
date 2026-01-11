const express = require('express');
const router = express.Router();
const { getShipping, updateShipping } = require('../controllers/shippingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getShipping) // User needs this to calculate checkout total
  .post(protect, admin, updateShipping); // Admin sets the rates

module.exports = router;