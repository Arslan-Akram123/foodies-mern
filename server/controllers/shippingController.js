const Shipping = require('../models/shippingModel');

// @route GET /api/shipping
const getShipping = async (req, res) => {
  const config = await Shipping.findOne({});
  res.json(config || {});
};

// @route POST /api/shipping (Admin Only)
const updateShipping = async (req, res) => {
  const config = await Shipping.findOneAndUpdate({}, req.body, { upsert: true, new: true });
  res.json(config);
};
module.exports = { getShipping, updateShipping };