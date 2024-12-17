const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    time: { type: Date, default: Date.now },
    user: { type: String, required: true },
    message: { type: String, required: true },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
    photoId: { type: String, required: true }
});

module.exports = mongoose.model('Comment', commentSchema);