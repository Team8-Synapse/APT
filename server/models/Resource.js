const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, enum: ['Coding', 'Aptitude', 'Technical', 'HR'], required: true },
    type: { type: String, enum: ['PDF', 'PPT', 'Link'], default: 'Link' },
    company: { type: String }, // Optional, if specific to a company
    content: { type: String, required: true },
    links: [String],
    tags: [String],
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
