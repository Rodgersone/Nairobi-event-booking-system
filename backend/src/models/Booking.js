const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true
  },
  ticketsCount: {
    type: Number,
    required: [true, 'Please specify how many tickets you are booking'],
    min: [1, 'Minimum 1 ticket required'],
    default: 1
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'cancelled'],
    default: 'pending'
  },
  mpesaCheckoutID: {
    type: String, // From Daraja STK Push response
    unique: true,
    sparse: true // Allows multiple 'null' values if payment hasn't started
  },
  mpesaReceiptNumber: {
    type: String, // From Daraja Callback (e.g., RHK012345)
    unique: true,
    sparse: true
  },
  qrCodeUrl: {
    type: String // URL to the generated PDF/Image ticket
  },
  bookedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent a user from booking more tickets than are available (Basic check)
bookingSchema.pre('save', async function(next) {
  const event = await mongoose.model('Event').findById(this.event);
  if (event.availableTickets < this.ticketsCount) {
    throw new Error('Not enough tickets available for this event');
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);