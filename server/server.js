const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('./services/mockMongoose');

dotenv.config();

const app = express();
const PORT = (process.env.PORT || '5005').toString().trim();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Database connection
mongoose.connect()
    .then(() => {
        console.log('Connected to Mock Database');
        // Check if we need to seed
        const mockDB = require('./services/mockDB');
        const collections = Object.keys(mockDB.data);
        if (collections.length === 0 || mockDB.getCollection('users').length === 0) {
            console.log('Database empty, seeding...');
            const seedData = require('./seedData');
            seedData();
        }
    })
    .catch(err => console.error('Could not connect to Mock Database', err));

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
const announcementRoutes = require('./routes/announcementRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/announcements', announcementRoutes);

app.get('/', (req, res) => {
    res.send('Placement Tracker API is running with Mock Database...');
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

