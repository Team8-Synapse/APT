const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String },
    type: {
        type: String,
        enum: ['drive', 'prep', 'alumni', 'other'],
        default: 'other'
    },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
