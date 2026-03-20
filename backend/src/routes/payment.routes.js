const express = require('express');
const router = express.Router();
const { stkPush } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

// Route for initiating the payment
router.post('/stk-push', protect, stkPush);

// Route for M-Pesa to send the result (MUST be public, no 'protect')
router.post('/callback', (req, res) => {
    console.log("📩 M-Pesa Callback Received:", JSON.stringify(req.body, null, 2));
    res.status(200).send("Callback Received");
});

module.exports = router;