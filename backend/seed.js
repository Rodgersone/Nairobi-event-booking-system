const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./src/models/Event');
const User = require('./src/models/User');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    await Event.deleteMany({});
    
    let admin = await User.findOne({ email: "admin@nairobievents.com" });
    if (!admin) {
      admin = await User.create({
        name: "System Admin",
        email: "admin@nairobievents.com",
        password: "password123", 
        phone: "254700000000", 
        role: "organizer"
      });
    }

    const sampleEvents = [
      {
        title: "Nairobi Tech Expo 2026",
        description: "The biggest gathering of innovators at KICC.",
        location: "KICC, Nairobi",
        date: new Date("2026-06-15"),
        category: "Workshop", // Mapped to allowed Enum
        price: 1500,
        totalTickets: 500,
        organizer: admin._id,
        image: "https://images.unsplash.com/photo-1540575861501-7ad058637b5b"
      },
      {
        title: "Alchemist Midnight Sessions",
        description: "Live decks and incredible vibes in Westlands.",
        location: "The Alchemist, Westlands",
        date: new Date("2026-04-20"),
        category: "Concert", // Mapped to allowed Enum
        price: 1000,
        totalTickets: 200,
        organizer: admin._id,
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745"
      },
      {
        title: "Nairobi Charity Gala",
        description: "A night of elegance and giving back to the community.",
        location: "Villa Rosa Kempinski",
        date: new Date("2026-05-30"),
        category: "Gala", // Mapped to allowed Enum
        price: 5000,
        totalTickets: 100,
        organizer: admin._id,
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
      }
    ];

    await Event.insertMany(sampleEvents);
    console.log("Database Seeded Successfully! ✅ Check localhost:5173 now.");
    process.exit();

  } catch (err) {
    console.error("Seeding Error:", err.message);
    process.exit(1);
  }
};

seedDB();