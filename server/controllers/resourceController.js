const Resource = require('../models/Resource');
const supabaseService = require('../services/supabaseService');
const fs = require('fs');

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
    console.log('=== ADD RESOURCE DEBUG ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    console.log('User:', req.user);
    try {
        const resourceData = { ...req.body };

        // Handle File Uploads
        if (req.file) {
            const isDocument =
                req.file &&
                (
                    req.file.mimetype === 'application/pdf' ||
                    req.file.mimetype === 'application/vnd.ms-powerpoint' ||
                    req.file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                );

            console.log('FILE:', {
                mimetype: req.file?.mimetype,
                typeFromBody: resourceData.type
            });

            if (isDocument) {
                try {
                    // Upload to Supabase Storage
                    const uploadResult = await supabaseService.uploadResourceFile(
                        req.file.path,
                        req.file.originalname
                    );

                    resourceData.storageFileId = uploadResult.fileId;
                    resourceData.storageFileUrl = uploadResult.fileUrl;
                    resourceData.links = [uploadResult.fileUrl];
                    resourceData.link = uploadResult.fileUrl;
                    resourceData.resourceUrl = uploadResult.fileUrl;

                    console.log('Supabase upload success:', uploadResult);

                    // Remove local file after successful upload
                    fs.unlinkSync(req.file.path);
                } catch (uploadError) {
                    console.error('Supabase upload failed:', uploadError);
                    throw new Error('Failed to upload file to Supabase');
                }
            } else {
                // Existing logic for other file types stored locally
                resourceData.links = [`uploads/${req.file.filename}`];
            }
        } else if (req.body.link) {
            resourceData.links = [req.body.link];
            resourceData.link = req.body.link; // Ensure 'link' is also set
            resourceData.resourceUrl = req.body.link;
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
        // Clean up local file if it exists and wasn't processed successfully
        if (req.file && fs.existsSync(req.file.path)) {
            try { fs.unlinkSync(req.file.path); } catch (err) { }
        }
        res.status(400).send({ message: e.message || e });
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
            const isDocument =
                req.file &&
                (
                    req.file.mimetype === 'application/pdf' ||
                    req.file.mimetype === 'application/vnd.ms-powerpoint' ||
                    req.file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                );

            if (isDocument) {
                // If replacing a file, delete the old one from Supabase
                const oldResource = await Resource.findById(req.params.id);
                if (oldResource && oldResource.storageFileId) {
                    try {
                        await supabaseService.deleteResourceFile(oldResource.storageFileId);
                    } catch (deleteErr) {
                        console.error('Failed to delete old file from Supabase:', deleteErr);
                    }
                }

                try {
                    const uploadResult = await supabaseService.uploadResourceFile(
                        req.file.path,
                        req.file.originalname
                    );

                    resourceData.storageFileId = uploadResult.fileId;
                    resourceData.storageFileUrl = uploadResult.fileUrl;
                    resourceData.links = [uploadResult.fileUrl];
                    resourceData.link = uploadResult.fileUrl;
                    resourceData.resourceUrl = uploadResult.fileUrl;

                    fs.unlinkSync(req.file.path);
                } catch (uploadError) {
                    console.error('Supabase upload failed:', uploadError);
                    throw new Error('Failed to upload file to Supabase');
                }
            } else {
                resourceData.links = [`uploads/${req.file.filename}`];
            }
        } else if (req.body.link) {
            resourceData.links = [req.body.link];
            resourceData.link = req.body.link; // Ensure 'link' is also set
            resourceData.resourceUrl = req.body.link;
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
        if (req.file && fs.existsSync(req.file.path)) { try { fs.unlinkSync(req.file.path); } catch (err) { } }
        res.status(400).send(e.message || e);
    }
};

exports.deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);
        if (!resource) return res.status(404).send();

        // Delete from Supabase Storage if it exists
        if (resource.storageFileId) {
            try {
                await supabaseService.deleteResourceFile(resource.storageFileId);
            } catch (deleteErr) {
                console.error('Failed to delete file from Supabase:', deleteErr);
            }
        }

        res.send(resource);
    } catch (e) {
        res.status(500).send(e.message || e);
    }
};
