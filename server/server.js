const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = (process.env.PORT || '5005').toString().trim();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => console.error('Could not connect to MongoDB', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const aiRoutes = require('./routes/aiRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const otpRoutes = require('./routes/otpRoutes');
<<<<<<< Updated upstream
=======
const announcementRoutes = require('./routes/announcementRoutes');
>>>>>>> Stashed changes
const noteRoutes = require('./routes/noteRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/otp', otpRoutes);
<<<<<<< Updated upstream
=======
app.use('/api/announcements', announcementRoutes);
>>>>>>> Stashed changes
app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => {
    res.send('Placement Tracker API is running...');
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

