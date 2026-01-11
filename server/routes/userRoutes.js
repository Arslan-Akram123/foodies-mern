const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, deleteUser, updateUserProfile, updateUserRole } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/', protect, getUsers);
router.delete('/:id', protect, admin, deleteUser);
router.put('/profile', protect, updateUserProfile);
router.put('/:id/role', protect, admin, updateUserRole);
module.exports = router;