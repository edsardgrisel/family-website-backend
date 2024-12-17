const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

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
