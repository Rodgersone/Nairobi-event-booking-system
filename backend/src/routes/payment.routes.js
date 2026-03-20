const express = require('express');
const router = express.Router();
const { stkPush, handleCallback } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

// Route for initiating the payment (Requires Login)
router.post('/stk-push', protect, stkPush);

// Route for M-Pesa Callback (Public)
router.post('/callback', handleCallback);

module.exports = router;