// controllers/chatController.js

const Chat = require('../models/chatModel');

// Get all chat messages
exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Chat.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new chat message
exports.addMessage = async (req, res) => {
    const { user, message } = req.body;

    const chatMessage = new Chat({
        user,
        message
    });

    try {
        const newMessage = await chatMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};