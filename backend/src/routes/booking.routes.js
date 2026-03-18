const Booking = require('../models/Booking');

// @desc    Get logged in user bookings
// @route   GET /api/bookings/my-bookings
exports.getMyBookings = async (req, res) => {
  try {
    // 1. Find bookings where 'user' field matches the ID from the token
    // 2. .populate('event') pulls the full event details (title, price, location)
    const bookings = await Booking.find({ user: req.user._id }).populate('event');

    // 3. Always return an array to the frontend to avoid 'map is not a function' errors
    res.status(200).json(bookings || []);
  } catch (error) {
    console.error("Booking Controller Error:", error.message);
    res.status(500).json({ message: "Server Error: Could not fetch bookings" });
  }
};