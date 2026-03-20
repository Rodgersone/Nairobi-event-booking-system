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
    type: String, 
    unique: true,
    sparse: true 
  },
  mpesaReceiptNumber: {
    type: String, 
    unique: true,
    sparse: true
  },
  qrCodeUrl: {
    type: String 
  },
  bookedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

bookingSchema.pre('save', async function(next) {
  const event = await mongoose.model('Event').findById(this.event);
  if (event && event.availableTickets < this.ticketsCount) {
    throw new Error('Not enough tickets available for this event');
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);