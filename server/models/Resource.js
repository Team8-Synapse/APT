const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, enum: ['Coding', 'Aptitude', 'Technical', 'HR'], required: true },
    company: { type: String }, // Optional, if specific to a company
    content: { type: String, required: true },
    links: [String],
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
