const express = require('express');
const router = express.Router();
const { 
  getCategories, 
  createCategory, 
  deleteCategory, 
  getCategoryById, 
  updateCategory 
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getCategories)
  .post(protect, admin, createCategory);

router.route('/:id')
  .get(getCategoryById) // This fixes the 404 error when opening the Edit page
  .put(protect, admin, updateCategory) // This allows saving the edits
  .delete(protect, admin, deleteCategory);

module.exports = router;