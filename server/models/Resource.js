const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, enum: ['Coding', 'Aptitude', 'Technical', 'HR'], required: true },
    type: { type: String, enum: ['PDF', 'PPT', 'Link'], default: 'Link' },
    company: { type: String },
    content: { type: String },

    link: { type: String },
    links: [String],

    resourceUrl: { type: String },   // ✅ ADD THIS

    tags: [String],
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    driveFileId: { type: String },
    driveFileLink: { type: String },
    cloudinaryFileId: { type: String },
    cloudinaryFileUrl: { type: String },
    storageFileId: { type: String },
    storageFileUrl: { type: String }
}, { timestamps: true });


module.exports = mongoose.model('Resource', resourceSchema);
