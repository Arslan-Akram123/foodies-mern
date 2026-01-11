const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Food = require('../models/foodModel');
const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/sendEmail');
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
    const emailHtml = `
  <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
    <h2 style="color: #ff4f00;">Order Confirmed!</h2>
    <p>Hi ${req.user.name}, your order <b>#${createdOrder._id.toString().slice(-6)}</b> has been placed successfully.</p>
    <hr/>
    <h3>Order Summary:</h3>
    <ul>
      ${createdOrder.orderItems.map(item => `<li>${item.qty}x ${item.name} - $${item.price}</li>`).join('')}
    </ul>
    <p><b>Total Amount: $${createdOrder.totalPrice}</b></p>
    <p>Delivery to: ${createdOrder.shippingAddress.address}, ${createdOrder.shippingAddress.city}</p>
    <hr/>
    <p>Track your order here: <a href="${process.env.FRONTEND_URL}/track-order/${createdOrder._id}">Track My Food</a></p>
  </div>
`;
sendEmail({
  email: req.user.email,
  subject: `Receipt for Order #${createdOrder._id.toString().slice(-6)}`,
  html: emailHtml
}).then(() => console.log("Email sent successfully", createdOrder._id.toString().slice(-6), req.user.email))
.catch(err => console.error("Email failed:", err));
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