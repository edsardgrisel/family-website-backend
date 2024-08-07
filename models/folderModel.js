const mongoose = require('mongoose');
const photoSchema = require('./photoModel').schema; // Import the photo schema

const folderSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    photos: [photoSchema] // Embed the photo schema
});

module.exports = mongoose.model('Folder', folderSchema);
