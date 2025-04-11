
const express = require('express');
const router = express.Router();
const { register, login, getProfile, oauthLogin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Routes
router.post('/register', register);
router.post('/login', login);
router.post('/oauth', oauthLogin);
router.get('/profile', protect, getProfile);

module.exports = router;
