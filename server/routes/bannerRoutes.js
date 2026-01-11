const express = require('express');
const router = express.Router();
const { 
  getBanners, 
  createBanner, 
  updateBanner, 
  deleteBanner, 
  getBannerById // 1. Import it here
} = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getBanners)
  .post(protect, admin, createBanner);

router.route('/:id')
  .get(getBannerById) // 2. This fixes the 404 error on the Edit page
  .put(protect, admin, updateBanner)
  .delete(protect, admin, deleteBanner);

module.exports = router;