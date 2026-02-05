const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const StudentProfile = require('../models/StudentProfile');
const { auth: authMiddleware } = require('../middleware/auth');

// Get all experiences
router.get('/', async (req, res) => {
    try {
        const filters = {};
        if (req.query.company) filters.companyName = new RegExp(req.query.company, 'i');

        const experiences = await Experience.find(filters)
            .populate('studentId', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json(experiences);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new experience
router.post('/', authMiddleware, async (req, res) => {
    try {
        // Find profile of current user to link
        const profile = await StudentProfile.findOne({ userId: req.user.id });
        if (!profile) {
            return res.status(404).json({ error: 'Create a student profile first' });
        }

        const newExperience = new Experience({
            ...req.body,
            studentId: profile._id
        });

        await newExperience.save();
        res.status(201).json(newExperience);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err)
    }
});

// Like an experience
router.put('/:id/like', authMiddleware, async (req, res) => {
    try {
        const exp = await Experience.findById(req.params.id);
        if (!exp) return res.status(404).json({ error: 'Not found' });

        const userId = req.user.id;
        if (exp.likes.includes(userId)) {
            exp.likes = exp.likes.filter(id => id.toString() !== userId);
        } else {
            exp.likes.push(userId);
        }
        await exp.save();
        res.json(exp);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
