const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    url: { type: String, required: true },
    date: { type: String, required: true },
});


module.exports = mongoose.model('Photo', photoSchema);
