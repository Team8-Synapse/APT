const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    text: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
