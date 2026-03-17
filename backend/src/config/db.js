const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // We removed the unsupported options here
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(` Nairobi DB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(` Database Connection Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;