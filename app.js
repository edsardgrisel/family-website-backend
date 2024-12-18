const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Connect to MongoDB
connectDB();

// Routes
const folderRouter = require('./routes/folderRouter');
app.use('/folders', folderRouter);
const authRouter = require('./routes/authRouter');
app.use('/auth', authRouter);
const calendarRouter = require('./routes/calendarRouter');
app.use('/calendar', calendarRouter);
const commentRouter = require('./routes/commentRouter');
app.use('/comments', commentRouter);
const chatRoutes = require('./routes/chatRoutes');
app.use('/chat', chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));