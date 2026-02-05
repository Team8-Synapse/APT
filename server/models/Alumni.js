const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    company: {
        type: String, // e.g., Google
        required: true
    },
    role: {
        type: String, // e.g., SDE-1
        required: true
    },
    batch: {
        type: Number, // e.g., 2024
        required: true
    },
    email: {
        type: String
    },
    linkedin: {
        type: String
    },
    department: {
        type: String // CSE, ECE
    }
}, { timestamps: true });

module.exports = mongoose.model('Alumni', alumniSchema);
