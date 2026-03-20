const Booking = require('../models/Booking');

// @desc    Get logged in user bookings
// @route   GET /api/bookings/my-bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('event', 'title price date')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  const { eventId, quantity, totalAmount } = req.body;

  try {
    const booking = new Booking({
      user: req.user.id,
      event: eventId,
      quantity,
      totalAmount,
      status: 'Pending'
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(400).json({ message: "Invalid booking data" });
  }
};