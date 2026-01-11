const express = require('express');
const router = express.Router();
const { addReview, getReviews, deleteReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getReviews) // Admin sees list
  .post(protect, addReview); // Logged in user reviews food

router.route('/:id').delete(protect, admin, deleteReview);

module.exports = router;