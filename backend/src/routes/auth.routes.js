const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');

// Public Routes
// Applied authLimiter to prevent brute-force attacks on login/register
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Private Routes (Require Token)
router.get('/me', protect, getMe);

module.exports = router;