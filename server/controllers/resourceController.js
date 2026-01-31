const Resource = require('../models/Resource');

exports.getResources = async (req, res) => {
    try {
        const { category, company } = req.query;
        let query = {};
        if (category) query.category = category;
        if (company) query.company = { $regex: company, $options: 'i' };

        const resources = await Resource.find(query).populate('addedBy', 'email');
        res.send(resources);
    } catch (e) {
        res.status(500).send(e);
    }
};

exports.addResource = async (req, res) => {
    try {
        const resource = new Resource({
            ...req.body,
            addedBy: req.user._id
        });
        await resource.save();
        res.status(201).send(resource);
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).send();
        res.send(resource);
    } catch (e) {
        res.status(500).send(e);
    }
};
