const Category = require('../models/categoryModel');
const asyncHandler = require('express-async-handler');
const getCategories = async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
};

const createCategory = async (req, res) => {
  const { name, image } = req.body;
  const category = await Category.create({ name, image });
  res.status(201).json(category);
};
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = req.body.name || category.name;
    category.image = req.body.image || category.image;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } else {
    res.status(404); throw new Error('Category not found');
  }
};

module.exports = { getCategories, createCategory, deleteCategory,getCategoryById, updateCategory };