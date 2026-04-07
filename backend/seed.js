// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const Event = require('./src/models/Event');
const User = require('./src/models/User');

// Connect to MongoDB
connectDB();

const seedData = async () => {
  try {
    // Clear old data
    await Event.deleteMany();
    await User.deleteMany({ email: 'organizer@example.com' });

    // Create a sample organizer
    const organizer = await User.create({
      name: 'Sample Organizer',
      email: 'organizer@example.com',
      phone: '254700000001',
      password: 'password123',
      role: 'organizer',
    });

    // Sample events
    const events = [
      {
        title: 'Concert at KICC',
        description: 'An amazing music concert with top artists performing live at KICC.',
        category: 'Concert',
        date: new Date(Date.now() + 86400000), // tomorrow
        location: 'KICC',
        price: 1500,
        totalTickets: 100,
        availableTickets: 100,
        image: '/images/concert-kicc.jpg',
        organizer: organizer._id
      },
      {
        title: 'Art Workshop',
        description: 'Learn to paint and sketch like a pro in this hands-on workshop.',
        category: 'Workshop',
        date: new Date(Date.now() + 172800000), // 2 days later
        location: 'Alchemist',
        price: 800,
        totalTickets: 50,
        availableTickets: 50,
        image: '/images/art-workshop.jpg',
        organizer: organizer._id
      },
      {
        title: 'Gala Night',
        description: 'A luxurious gala night with dinner, drinks, and live entertainment.',
        category: 'Gala',
        date: new Date(Date.now() + 259200000), // 3 days later
        location: 'Sarabi Rooftop',
        price: 3500,
        totalTickets: 75,
        availableTickets: 75,
        image: '/images/gala-night.jpg',
        organizer: organizer._id
      },
      {
        title: 'Football Match',
        description: 'Watch the top teams battle it out in a thrilling match.',
        category: 'Sports',
        date: new Date(Date.now() + 345600000), // 4 days later
        location: 'Moi International Stadium',
        price: 1200,
        totalTickets: 200,
        availableTickets: 200,
        image: '/images/football-match.jpg',
        organizer: organizer._id
      },
      {
        title: 'Food Festival',
        description: 'Taste dishes from top chefs around Nairobi.',
        category: 'Other',
        date: new Date(Date.now() + 432000000), // 5 days later
        location: 'Ngong Racecourse',
        price: 500,
        totalTickets: 150,
        availableTickets: 150,
        image: '/images/food-festival.jpg',
        organizer: organizer._id
      }
    ];

    await Event.insertMany(events);
    console.log('✅ Sample events added successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
};

seedData();