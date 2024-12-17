const Comment = require('../models/commentModel');

// Add a comment
exports.addComment = async (req, res) => {
    const { user, message, folderId, photoId } = req.body;

    if (!user || !message || !folderId || !photoId) {
        return res.status(400).json({ success: false, message: 'User, message, folderId, and photoId are required' });
    }

    try {
        const newComment = new Comment({ user, message, folderId, photoId });
        await newComment.save();
        res.status(201).json({ success: true, comment: newComment });
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get comments by folderId and photoId
exports.getComments = async (req, res) => {
    const { folderId, photoId } = req.params;

    try {
        const comments = await Comment.find({ folderId, photoId });
        res.status(200).json({ success: true, comments });
    } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};