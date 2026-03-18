const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Route Imports
const authRoutes = require('./routes/auth.routes'); 
const eventRoutes = require('./routes/event.routes');
const paymentRoutes = require('./routes/payment.routes');
const bookingRoutes = require('./routes/booking.routes'); 

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes - Matches your frontend calls
app.use('/api/auth', authRoutes); 
app.use('/api/events', eventRoutes);
app.use('/api/payments', paymentRoutes); 
app.use('/api/bookings', bookingRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));