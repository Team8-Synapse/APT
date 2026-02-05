const Announcement = require('../models/Announcement');

exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.send(announcements);
    } catch (e) {
        res.status(500).send(e);
    }
};

exports.addAnnouncement = async (req, res) => {
    try {
        const announcement = new Announcement({
            ...req.body,
            addedBy: req.user._id
        });
        await announcement.save();
        res.status(201).send(announcement);
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.updateAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!announcement) return res.status(404).send();
        res.send(announcement);
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);
        if (!announcement) return res.status(404).send();
        res.send(announcement);
    } catch (e) {
        res.status(500).send(e);
    }
};
