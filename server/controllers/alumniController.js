const AlumniInsight = require('../models/AlumniInsight');
const Alumni = require('../models/Alumni');

// Get Curated Strategy Reports
exports.getInsights = async (req, res) => {
    try {
        const { company } = req.query;
        let query = {};
        if (company) query.company = { $regex: company, $options: 'i' };

        const insights = await AlumniInsight.find(query);
        res.send(insights);
    } catch (e) {
        res.status(500).send(e);
    }
};

// Add Strategy Report
exports.addInsight = async (req, res) => {
    try {
        const insight = new AlumniInsight(req.body);
        await insight.save();
        res.status(201).send(insight);
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.getTopics = async (req, res) => {
    try {
        const insights = await AlumniInsight.find().distinct('rounds.topics');
        res.send(insights);
    } catch (e) {
        res.status(500).send(e);
    }
};

// Get Alumni Directory (Manual Admin Entries)
exports.getDirectory = async (req, res) => {
    try {
        const { company } = req.query;
        let query = {};
        if (company) query.company = { $regex: company, $options: 'i' };

        // Fetch from the manual Alumni collection
        const alumni = await Alumni.find(query).sort({ batch: -1 });

        res.json(alumni);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// Add Alumni Member (Admin Only)
exports.addAlumni = async (req, res) => {
    try {
        const alumni = new Alumni(req.body);
        await alumni.save();
        res.status(201).json(alumni);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

// Update Alumni Member
exports.updateAlumni = async (req, res) => {
    try {
        const alumni = await Alumni.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!alumni) return res.status(404).json({ error: 'Alumni not found' });
        res.json(alumni);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

// Delete Alumni Member
exports.deleteAlumni = async (req, res) => {
    try {
        const alumni = await Alumni.findByIdAndDelete(req.params.id);
        if (!alumni) return res.status(404).json({ error: 'Alumni not found' });
        res.json({ message: 'Alumni deleted' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
