const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const query = {
            $or: [
                { userId: req.user._id },
                { targetRole: req.user.role },
                { targetRole: 'all' }
            ]
        };
        const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(20);
        res.send(notifications);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { read: true },
            { new: true }
        );
        if (!notification) return res.status(404).send();
        res.send(notification);
    } catch (e) {
        res.status(500).send(e);
    }
};

exports.createNotification = async (req, res) => {
    try {
        const notification = new Notification(req.body);
        await notification.save();
        res.status(201).send(notification);
    } catch (e) {
        res.status(400).send(e);
    }
};
