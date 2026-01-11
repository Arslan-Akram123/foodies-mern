// server/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const { 
  addOrderItems, 
  getOrderById, 
  getMyOrders, 
  getOrders, 
  updateOrderStatus,
  getDashboardStats // Make sure this is imported
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// 1. Static routes FIRST
router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);

// CRITICAL: Move this ABOVE the /:id route
router.get('/stats', protect, admin, getDashboardStats); 

// 2. Dynamic routes (with :id) LAST
router.route('/:id')
  .get(protect, getOrderById) 
  .put(protect, admin, updateOrderStatus);

module.exports = router;