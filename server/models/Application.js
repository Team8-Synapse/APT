const mongoose = require('../services/mockMongoose');

const applicationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentProfile',
        required: true
    },
    driveId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PlacementDrive',
        required: true
    },
    status: {
        type: String,
        enum: ['applied', 'shortlisted', 'round1', 'round2', 'round3', 'hr_round', 'offered', 'rejected', 'accepted', 'declined'],
        default: 'applied'
    },
    appliedDate: { type: Date, default: Date.now },
    currentRound: { type: Number, default: 0 },
    rounds: [{
        roundNumber: Number,
        roundName: String,
        date: Date,
        status: { type: String, enum: ['pending', 'passed', 'failed', 'scheduled'] },
        feedback: String,
        interviewer: String
    }],
    offeredCTC: { type: Number },
    offerLetterUrl: { type: String },
    joiningDate: { type: Date },
    notes: { type: String },
    internalRating: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

// Ensure one application per student per drive
applicationSchema.index({ studentId: 1, driveId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
