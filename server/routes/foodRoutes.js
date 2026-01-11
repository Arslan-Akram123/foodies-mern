const express = require('express');
const router = express.Router();
const { getFoods, createFood, updateFood, deleteFood } = require('../controllers/foodController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getFoods)               // Public: See Menu
  .post(protect, admin, createFood); // Private: Admin Add Food

router.route('/:id')
  .put(protect, admin, updateFood)   // Private: Admin Edit Food
  .delete(protect, admin, deleteFood); // Private: Admin Delete Food

module.exports = router;