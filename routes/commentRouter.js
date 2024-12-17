const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Add a comment
router.post('/add', commentController.addComment);

// Get comments by folderId and photoId
router.get('/:folderId/:photoId', commentController.getComments);

module.exports = router;