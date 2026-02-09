const Resource = require('../models/Resource');
const supabaseService = require('../services/supabaseService');

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
        const resourceData = { ...req.body };

        if (req.file) {
            const { url, error } = await supabaseService.uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
            if (error) throw error;
            resourceData.links = [url];
        } else if (req.body.link) {
            resourceData.links = [req.body.link];
        }

        // Handle tags sent via FormData (often as a JSON string)
        if (typeof resourceData.tags === 'string' && resourceData.tags.startsWith('[')) {
            try {
                resourceData.tags = JSON.parse(resourceData.tags);
            } catch (e) {
                resourceData.tags = resourceData.tags.split(',').map(t => t.trim());
            }
        }

        const resource = new Resource({
            ...resourceData,
            addedBy: req.user._id
        });
        await resource.save();
        res.status(201).send(resource);
    } catch (e) {
        console.error('Add resource error:', e);
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

exports.updateResource = async (req, res) => {
    try {
        const resourceData = { ...req.body };
        if (req.file) {
            const { url, error } = await supabaseService.uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
            if (error) throw error;
            resourceData.links = [url];
        } else if (req.body.link) {
            resourceData.links = [req.body.link];
        }

        if (typeof resourceData.tags === 'string' && resourceData.tags.startsWith('[')) {
            try {
                resourceData.tags = JSON.parse(resourceData.tags);
            } catch (e) {
                resourceData.tags = resourceData.tags.split(',').map(t => t.trim());
            }
        }

        const resource = await Resource.findByIdAndUpdate(req.params.id, resourceData, { new: true });
        if (!resource) return res.status(404).send();
        res.send(resource);
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);
        if (!resource) return res.status(404).send();

        // Delete associated file from Supabase if it exists
        if (resource.links && resource.links.length > 0) {
            const link = resource.links[0];
            if (link.includes('supabase.co')) {
                await supabaseService.deleteFile(link);
            }
        }
        res.send(resource);
    } catch (e) {
        res.status(500).send(e);
    }
};
