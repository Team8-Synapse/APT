const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    department: { type: String, required: true },
    cgpa: { type: Number, required: true },
    batch: { type: String, required: true },
    backlogs: { type: Number, default: 0 },
    skills: [{
        name: { type: String },
        level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] }
    }],
    certifications: [String],
    isEligible: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
