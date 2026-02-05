const mongoose = require('../services/mockMongoose');

const announcementSchema = new mongoose.Schema({
    content: { type: String, required: true },
    links: [{
        title: String,
        url: String
    }],
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
