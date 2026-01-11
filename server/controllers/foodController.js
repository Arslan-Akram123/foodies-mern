const Food = require('../models/foodModel');

// @desc    Get all foods (with optional category filter for Menu page)
// @route   GET /api/foods
const getFoods = async (req, res) => {
  const { category, keyword } = req.query;

  let query = {};

  // Filter by Category
  if (category && category !== 'All') {
    query.category = category;
  }

  // Filter by Search Keyword (Case-insensitive)
  if (keyword) {
    query.name = { $regex: keyword, $options: 'i' };
  }

  const foods = await Food.find(query).sort({ createdAt: -1 });
  res.json(foods);
};

// @desc    Create a food (Admin Only)
// @route   POST /api/foods
const createFood = async (req, res) => {
  const { name, description, price, image, category, status } = req.body;

  const food = await Food.create({
    name, description, price, image, category, status
  });

  if (food) res.status(201).json(food);
  else {
    res.status(400);
    throw new Error('Invalid food data');
  }
};

// @desc    Update food (Admin Only)
const updateFood = async (req, res) => {
  const food = await Food.findById(req.params.id);

  if (food) {
    food.name = req.body.name || food.name;
    food.description = req.body.description || food.description;
    food.price = req.body.price || food.price;
    food.image = req.body.image || food.image;
    food.category = req.body.category || food.category;
    food.status = req.body.status || food.status;

    const updatedFood = await food.save();
    res.json(updatedFood);
  } else {
    res.status(404);
    throw new Error('Food not found');
  }
};

// @desc    Delete food (Admin Only)
const deleteFood = async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (food) {
    await food.deleteOne();
    res.json({ message: 'Food removed' });
  } else {
    res.status(404);
    throw new Error('Food not found');
  }
};

module.exports = { getFoods, createFood, updateFood, deleteFood };