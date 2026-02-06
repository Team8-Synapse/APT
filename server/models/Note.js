const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
