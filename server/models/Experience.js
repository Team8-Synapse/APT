const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentProfile',
        required: true
    },
    // Denormalized user info for ease of display (optional, but using populate typically)
    companyName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    type: {
        type: String, // Internship, Full Time
        default: 'Full Time'
    },
    year: {
        type: Number,
        default: new Date().getFullYear()
    },
    verdict: {
        type: String,
        enum: ['Selected', 'Rejected', 'Pending'],
        default: 'Selected'
    },
    difficulty: {
        type: Number, // 1-5
        default: 3
    },
    rounds: [{
        roundName: String, // "Technical Round 1"
        questions: [String], // "Reverse a linked list"
        description: String
    }],
    tips: {
        type: String
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
