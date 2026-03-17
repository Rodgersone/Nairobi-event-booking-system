const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings } = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth');

// All booking routes require the user to be logged in
router.use(protect);

// @route   POST /api/bookings
// @desc    Book an event and trigger M-Pesa push
router.post('/', createBooking);

// @route   GET /api/bookings/my-bookings
// @desc    View current user's tickets
router.get('/my-bookings', getMyBookings);

module.exports = router;