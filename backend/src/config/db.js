const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    // Mongoose v6+ auto-handles parser & topology
    await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ Database Connection Error:', err.message);
    process.exit(1); // Exit process if DB connection fails
  }
};

module.exports = connectDB;