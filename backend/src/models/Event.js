const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an event title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Concert', 'Gala', 'Workshop', 'Sports', 'Other']
  },
  date: {
    type: Date,
    required: [true, 'Please add an event date']
  },
  location: {
    type: String,
    required: [true, 'Please add a location (e.g., KICC, Alchemist)']
  },
  price: {
    type: Number,
    required: [true, 'Please add a ticket price in KES'],
    min: [0, 'Price cannot be negative']
  },
  totalTickets: {
    type: Number,
    required: [true, 'Please add total available tickets'],
    min: [1, 'At least 1 ticket must be available']
  },
  availableTickets: {
    type: Number,
    default: function() {
      return this.totalTickets;
    }
  },
  image: {
    type: String,
    default: 'no-photo.jpg' // This will be updated by Cloudinary later
  },
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexing for faster searching of events by date and location
eventSchema.index({ date: 1, location: 'text' });

module.exports = mongoose.model('Event', eventSchema);