const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 1. Load env variables FIRST to ensure API keys are available
dotenv.config();

// 2. Connect to MongoDB
connectDB();

const app = express();

// 3. Middleware
app.use(cors());
app.use(express.json());

// 4. Route Imports
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');
const paymentRoutes = require('./routes/payment.routes');
const bookingRoutes = require('./routes/booking.routes');

// 5. API Route Mounting
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/payments', paymentRoutes); // This now uses protected /stk-push
app.use('/api/bookings', bookingRoutes);

// 6. Root/Health Check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Nairobi Events API is running...' });
});

// 7. Global Error Handler (Prevents "next is not a function" crashes)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Payment Callback URL: ${process.env.MPESA_CALLBACK_URL}`);
});