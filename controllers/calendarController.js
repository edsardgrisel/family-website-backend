const Event = require('../models/eventModel');

// Add an event
exports.addEvent = async (req, res) => {
    const { title, start, end, allDay, description } = req.body;

    if (!title || !start || !end) {
        return res.status(400).json({ success: false, message: 'Title, start, and end are required' });
    }

    try {
        const newEvent = new Event({ title, start, end, allDay, description });
        await newEvent.save();
        res.status(201).json({ success: true, event: newEvent });
    } catch (err) {
        console.error('Error adding event:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json({ success: true, events });
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    const { eventId } = req.params;

    try {
        const event = await Event.findByIdAndDelete(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        res.status(200).json({ success: true, message: 'Event deleted successfully' });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};