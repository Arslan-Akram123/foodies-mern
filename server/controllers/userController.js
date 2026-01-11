const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('express-async-handler');
// @desc    Register new user
// @route   POST /api/users/signup
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
 console.log(req.body); 
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
};
const getUsers = async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  console.log(users);
  res.json(users);
};
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.role === 'admin') {
      res.status(400); throw new Error('Cannot delete admin user');
    }
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404); throw new Error('User not found');
  }
};
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.avatar = req.body.avatar || user.avatar; // Update avatar
    
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar, // Return avatar
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.role = req.body.role || user.role;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = { registerUser, loginUser, getUsers, deleteUser, updateUserProfile, updateUserRole };