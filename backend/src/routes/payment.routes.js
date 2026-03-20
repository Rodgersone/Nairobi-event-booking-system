const express = require('express');
const router = express.Router();
const { stkPush, handleCallback } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

/**
 * @desc    Initiate M-Pesa STK Push
 * @access  Private (Requires Login)
 */
router.post('/stk-push', protect, stkPush);

/**
 * @desc    M-Pesa Callback URL (Safaricom calls this)
 * @access  Public (No middleware)
 */
router.post('/callback', handleCallback);

module.exports = router;