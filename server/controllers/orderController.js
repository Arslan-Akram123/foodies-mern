const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Food = require('../models/foodModel');
const asyncHandler = require('express-async-handler');
// @desc    Create new order
// @route   POST /api/orders
const addOrderItems = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, shippingPrice, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id, // From protect middleware
      shippingAddress,
      paymentMethod,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
};

// @desc    Get order by ID (For Track Order / Detail Page)
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Get logged in user orders (For My Orders Page)
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// @desc    Get all orders (Admin Only)
const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
  res.json(orders);
};

// @desc    Update order status (Admin Only)
const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status || order.status;
    if (req.body.status === 'Delivered') {
      order.deliveredAt = Date.now();
    }
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};


const getDashboardStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalFoods = await Food.countDocuments();
  
  const revenueData = await Order.aggregate([
    { $match: { status: 'Delivered' } },
    { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
  ]);
  
  const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(6);

  res.status(200).json({
    totalRevenue,
    totalOrders,
    totalUsers,
    totalFoods,
    recentOrders
  });
});

module.exports = { addOrderItems, getOrderById, getMyOrders, getOrders, updateOrderStatus, getDashboardStats };