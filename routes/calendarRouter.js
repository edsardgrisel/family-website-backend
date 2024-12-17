const express = require('express');
const router = express.Router();
const eventController = require('../controllers/calendarController');

// Add an event
router.post('/add', eventController.addEvent);

// Get all events
router.get('/', eventController.getAllEvents);

// Delete an event
router.delete('/:eventId', eventController.deleteEvent);

module.exports = router;