const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/event.controller');

// Import authentication middleware
const { protect, authorize } = require('../middleware/auth');

// Public Routes (Anyone can see events in Nairobi)
router.get('/', getEvents);
router.get('/:id', getEvent);

// Protected Routes (Must be logged in)
router.post('/', protect, authorize('organizer', 'admin'), createEvent);
router.put('/:id', protect, authorize('organizer', 'admin'), updateEvent);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);

module.exports = router;