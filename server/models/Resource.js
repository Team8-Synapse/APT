const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, enum: ['Coding', 'Aptitude', 'Technical', 'HR'], required: true },
    type: { type: String, enum: ['PDF', 'PPT', 'Link', 'Video', 'Article'], default: 'Link' },
    company: { type: String }, // Optional, if specific to a company
    content: { type: String },
    link: { type: String },
    links: [String],
    tags: [String],
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
