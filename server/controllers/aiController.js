const aiService = require('../services/AI.service');
const StudentProfile = require('../models/StudentProfile');

exports.getInsights = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ userId: req.user._id });
        if (!profile) return res.status(404).send({ error: 'Profile not found. Please complete your profile first.' });

        const readinessScore = aiService.calculateReadinessScore(profile);
        const recommendations = await aiService.getRecommendations(profile);

        res.send({
            readinessScore,
            recommendations,
            insights: "Your readiness score is calculated based on your CGPA and skill set. Consider improving your technical skills to increase matching probability."
        });
    } catch (e) {
        res.status(500).send(e);
    }
};

exports.getChatResponse = async (req, res) => {
    try {
        const { message } = req.body;
        // Mock LLM Response for now
        const response = `Based on your query: "${message}", I recommend focusing on Data Structures and Algorithms for most top-tier placement drives. Amrita students often find success by practicing specific company patterns available in the Prep Hub.`;
        res.send({ response });
    } catch (e) {
        res.status(500).send(e);
    }
};
