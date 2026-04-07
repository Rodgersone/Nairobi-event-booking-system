require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const morgan = require('morgan');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/events', require('./routes/event.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/payments', require('./routes/payment.routes'));

// Health Check
app.get('/', (req, res) => res.json({ message: '🚀 Nairobi Events API is running...' }));

// Undefined routes
app.use((req, res) => res.status(404).json({ message: '❌ Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(process.env.MPESA_CALLBACK_URL
    ? `🔗 Payment Callback URL: ${process.env.MPESA_CALLBACK_URL}`
    : '⚠️ MPESA_CALLBACK_URL not set'
  );
});