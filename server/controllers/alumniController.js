const AlumniInsight = require('../models/AlumniInsight');

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
