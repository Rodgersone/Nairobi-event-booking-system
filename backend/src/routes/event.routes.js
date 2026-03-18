const express = require('express');
const router = express.Router();
// ✅ FIXED: Correctly importing the exported functions
const { 
    getEvents, 
    getEvent, 
    createEvent, 
    updateEvent, 
    deleteEvent 
} = require('../controllers/event.controller');

// ✅ FIXED: Mapping paths to the controller functions
router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router; // CRITICAL: Exporting the router for server.js