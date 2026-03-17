const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.ObjectId,
    ref: 'Booking',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true // The 254... number that made the payment
  },
  checkoutRequestID: {
    type: String,
    required: true,
    unique: true
  },
  mpesaReceiptNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Cancelled'],
    default: 'Pending'
  },
  resultDesc: {
    type: String // Stores "The service request is processed successfully" or "Request cancelled by user"
  },
  transactionDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexing for Admin Analytics (Searching by status or phone)
paymentSchema.index({ status: 1, phoneNumber: 1 });

module.exports = mongoose.model('Payment', paymentSchema);