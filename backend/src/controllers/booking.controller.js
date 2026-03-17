const Booking = require('../models/Booking');
const Event = require('../models/Event');
const mpesaService = require('../services/mpesa.service');

// @desc    Create new booking and trigger M-Pesa Payment
// @route   POST /api/bookings
exports.createBooking = async (req, res, next) => {
  try {
    const { eventId, ticketsCount, phoneNumber } = req.body;

    // 1. Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 2. Check ticket availability
    if (event.availableTickets < ticketsCount) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    // 3. Calculate total amount
    const totalAmount = event.price * ticketsCount;

    // 4. Create the booking in 'pending' status
    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      ticketsCount,
      totalAmount,
      paymentStatus: 'pending'
    });

    // 5. Trigger M-Pesa STK Push
    // We pass the booking ID so we can identify it in the callback later
    const mpesaResponse = await mpesaService.stkPush(
      phoneNumber, 
      totalAmount, 
      booking._id
    );

    // 6. Update booking with the CheckoutRequestID from Safaricom
    booking.mpesaCheckoutID = mpesaResponse.CheckoutRequestID;
    await booking.save();

    res.status(201).json({
      success: true,
      message: "STK Push sent to your phone. Please enter your PIN.",
      bookingId: booking._id,
      checkoutID: mpesaResponse.CheckoutRequestID
    });

  } catch (err) {
    next(err);
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('event', 'title date location price')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};