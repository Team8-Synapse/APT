const mongoose = require('mongoose');

const placementDriveSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    jobProfile: { type: String, required: true },
    description: { type: String },
    eligibility: {
        minCgpa: { type: Number, default: 0 },
        allowedBatches: [String],
        maxBacklogs: { type: Number, default: 0 }
    },
    date: { type: Date, required: true },
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
    requirements: [String]
}, { timestamps: true });

module.exports = mongoose.model('PlacementDrive', placementDriveSchema);
