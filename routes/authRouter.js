const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Verify password
router.post('/verifyPassword', authController.verifyPassword);

module.exports = router;
