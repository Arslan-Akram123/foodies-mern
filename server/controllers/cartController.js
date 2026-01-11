const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  // Find cart and populate food details if you need them for the UI
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    res.status(200).json(cart);
  } else {
    // If no cart exists yet, return an empty structure instead of an error
    res.status(200).json({ items: [], totalQuantity: 0, totalAmount: 0 });
  }
});

// @desc    Add or Update item in cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { food, name, image, price, qty } = req.body;

  if (!food || !qty) {
    res.status(400);
    throw new Error('Product ID and quantity are required');
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    // Check if product already exists in the cart items array
    const itemIndex = cart.items.findIndex((item) => item.food.toString() === food);

    if (itemIndex > -1) {
      // ITEM EXISTS: Update the quantity to the new value sent from frontend
      // If you want to "add to existing", use: cart.items[itemIndex].qty += qty;
      cart.items[itemIndex].qty = qty; 
    } else {
      // ITEM IS NEW: Add to the items array
      cart.items.push({ food, name, image, price, qty });
    }

    // Filter out items with 0 or negative quantity just in case
    cart.items = cart.items.filter(item => item.qty > 0);

    const updatedCart = await cart.save();
    res.status(201).json(updatedCart);
  } else {
    // NO CART EXISTS: Create a brand new cart for the user
    const newCart = await Cart.create({
      user: req.user._id,
      items: [{ food, name, image, price, qty }]
    });
    res.status(201).json(newCart);
  }
});

// @desc    Remove specific item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  // Use the ID passed in params (Product ID) to filter the array
  const initialLength = cart.items.length;
  cart.items = cart.items.filter((item) => item.food.toString() !== req.params.id);

  if (cart.items.length === initialLength) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  const updatedCart = await cart.save();
  res.status(200).json(updatedCart);
});

module.exports = { getCart, addToCart, removeItem };