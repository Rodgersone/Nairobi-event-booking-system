const express = require('express');
const router = express.Router();
const mpesaService = require('../services/mpesa.service');

// Route to start payment
router.post('/stk-push', async (req, res) => {
  const { phone, amount, bookingId } = req.body;
  try {
    const result = await mpesaService.initiateSTKPush(phone, amount, bookingId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Callback route (This is where Safaricom sends data)
router.post('/callback', (req, res) => {
  console.log('--- M-PESA CALLBACK RECEIVED ---');
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).send('Success');
});

module.exports = router;