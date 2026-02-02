const mongoose = require('../services/mockMongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    targetRole: { type: String, enum: ['all', 'student', 'admin'] },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['info', 'success', 'warning', 'error', 'drive', 'result', 'deadline', 'announcement'],
        default: 'info'
    },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    link: { type: String },
    relatedDrive: { type: mongoose.Schema.Types.ObjectId, ref: 'PlacementDrive' },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    expiresAt: { type: Date },
    actionRequired: { type: Boolean, default: false },
    actionLabel: { type: String },
    actionUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
