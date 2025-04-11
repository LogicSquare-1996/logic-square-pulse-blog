
const express = require('express');
const router = express.Router();
const { 
  updateProfile, 
  getUserBlogs, 
  getUserById, 
  getUsers 
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

// Routes
router.route('/profile')
  .put(protect, updateProfile);

router.route('/:id')
  .get(getUserById);

router.route('/:id/blogs')
  .get(getUserBlogs);

router.route('/')
  .get(protect, admin, getUsers);

module.exports = router;
