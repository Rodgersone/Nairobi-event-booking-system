const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
require('dotenv').config();

// Import DB connection and Error Handler
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/security');

const app = express();
const server = http.createServer(app);

// 1. Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// 2. Attach io to the app early so it's available in the Payment Controller
app.set('socketio', io);

// 3. Connect to MongoDB
connectDB();

// 4. Global Middleware
app.use(helmet()); 
app.use(cors());
app.use(express.json());

// 5. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { message: "Too many requests, please try again after 15 minutes" }
});
app.use('/api/', limiter);

// 6. Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/events', require('./routes/event.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/payments', require('./routes/payment.routes'));

// 7. Health Check Route
app.get('/', (req, res) => {
  res.json({ 
    status: "Success",
    message: "Nairobi Event Booking API is fully operational 🚀",
    timestamp: new Date().toISOString(),
    currency: "KES"
  });
});

// 8. Handle 404 - Keep this before the error handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 9. Socket.io Connection Logic
io.on('connection', (socket) => {
  console.log(' Client connected to Socket.io:', socket.id);
  
  socket.on('disconnect', () => {
    console.log(' Client disconnected');
  });
});

// 10. Global Error Handler (MUST be the last middleware)
app.use(errorHandler);

// 11. Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
  --------------------------------------------------
   Server running in ${process.env.NODE_ENV || 'development'} mode
   Listening on port: ${PORT}
   Health Check: http://localhost:${PORT}/
  --------------------------------------------------
  `);
});

module.exports = { app, server };