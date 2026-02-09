const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    content: { type: String, required: true },
    priority: {
        type: String,
        enum: ['urgent', 'high', 'normal', 'low'],
        default: 'normal'
    },
    targetAudience: {
        type: String,
        default: 'all'
    },
    category: {
        type: String,
        default: 'general'
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published'
    },
    scheduledDate: { type: Date },
    expiryDate: { type: Date },
    isPinned: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    links: [{
        title: String,
        url: String
    }],
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
