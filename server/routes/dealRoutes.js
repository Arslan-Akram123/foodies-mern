const express = require('express');
const router = express.Router();
const { getDeals, createDeal, updateDeal, deleteDeal } = require('../controllers/dealController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getDeals).post(protect, admin, createDeal);
router.route('/:id').put(protect, admin, updateDeal).delete(protect, admin, deleteDeal);

module.exports = router;