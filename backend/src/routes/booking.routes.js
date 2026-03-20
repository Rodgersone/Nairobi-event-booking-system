const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth.middleware');
const {
  getUserBookings,
  createBooking
} = require('../controllers/booking.controller');

// Get logged-in user's bookings
router.get('/my-bookings', protect, getUserBookings);

// Create booking
router.post('/', protect, createBooking);

module.exports = router;