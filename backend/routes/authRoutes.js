
const express = require('express');
const router = express.Router();
const { register, login, adminLogin, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/admin/login', adminLogin); // Temporarily no rate limiter
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
