const express = require('express');
const router = express.Router();
// ✅ FIXED: Destructuring ensures we get the functions, not an undefined object
const { stkPush } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware'); 

// ✅ FIXED: Adding the 'protect' middleware correctly
router.post('/stk-push', protect, stkPush);

module.exports = router; // CRITICAL: Exporting the router for server.js