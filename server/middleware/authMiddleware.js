const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// 1. Authentication Middleware (Is the user logged in?)
const protect = async (req, res, next) => {
  let token;

  // Check for token in the Authorization header: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach to the request object (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
};

// 2. Authorization Middleware (Is the user an Admin?)
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403); // 403 Forbidden is more accurate for role issues
    throw new Error('Access Denied: Admin privileges required');
  }
};

module.exports = { protect, admin };