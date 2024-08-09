const mongoose = require('mongoose');
const folderSchema = require('./folderModel').schema;
const Schema = mongoose.Schema;

const homePageSchema = new mongoose.Schema({
    photoUrl: { type: String, required: true },
    favouriteFolders: [{ type: String, required: true }],
});

module.exports = mongoose.model('HomePage', homePageSchema);
