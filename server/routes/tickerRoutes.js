const express = require('express');
const router = express.Router();
const Ticker = require('../models/Ticker');

// GET all active ticker messages
router.get('/', async (req, res) => {
    try {
        const tickers = await Ticker.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(tickers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new ticker message (Append to existing)
router.post('/', async (req, res) => {
    try {
        const { message, priority } = req.body;
        // Removed deactivation of previous tickers to allow multiple
        const newTicker = new Ticker({
            message,
            priority: priority || 'normal',
            isActive: true
        });

        const savedTicker = await newTicker.save();
        res.status(201).json(savedTicker);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE ticker message (deactivate)
router.delete('/:id', async (req, res) => {
    try {
        const ticker = await Ticker.findById(req.params.id);
        if (!ticker) return res.status(404).json({ message: 'Ticker not found' });

        ticker.isActive = false;
        await ticker.save();
        res.json({ message: 'Ticker deactivated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
