const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Get all chat messages
router.get('/', chatController.getAllMessages);

// Add a new chat message
router.post('/', chatController.addMessage);

module.exports = router;