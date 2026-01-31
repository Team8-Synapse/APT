const StudentProfile = require('../models/StudentProfile');

exports.getProfile = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ userId: req.user._id });
        if (!profile) return res.status(404).send({ error: 'Profile not found' });
        res.send(profile);
    } catch (e) {
        res.status(500).send(e);
    }
};

exports.upsertProfile = async (req, res) => {
    try {
        const profile = await StudentProfile.findOneAndUpdate(
            { userId: req.user._id },
            { ...req.body, userId: req.user._id },
            { new: true, upsert: true, runValidators: true }
        );
        res.send(profile);
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.getEligibility = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ userId: req.user._id });
        if (!profile) return res.status(404).send({ error: 'Profile not found' });

        // Simple eligibility mapping
        const isEligible = profile.cgpa >= 6.0 && profile.backlogs === 0;
        res.send({ isEligible, cgpa: profile.cgpa, backlogs: profile.backlogs });
    } catch (e) {
        res.status(500).send(e);
    }
};
