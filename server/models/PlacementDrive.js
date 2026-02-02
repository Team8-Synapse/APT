const mongoose = require('../services/mockMongoose');

const placementDriveSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    companyLogo: { type: String },
    companyWebsite: { type: String },
    companyDescription: { type: String },
    industry: { type: String },
    jobProfile: { type: String, required: true },
    jobDescription: { type: String },
    jobType: { type: String, enum: ['Full Time', 'Internship', 'Internship + FTE'], default: 'Full Time' },
    date: { type: Date, required: true },
    registrationDeadline: { type: Date },
    venue: { type: String, default: 'Campus' },
    mode: { type: String, enum: ['Online', 'Offline', 'Hybrid'], default: 'Offline' },
    description: { type: String },
    requirements: [String],
    eligibility: {
        minCgpa: { type: Number, default: 0 },
        allowedBatches: [String],
        allowedDepartments: [String],
        maxBacklogs: { type: Number, default: 0 },
        minTenthPercentage: { type: Number },
        minTwelfthPercentage: { type: Number }
    },
    ctcDetails: {
        ctc: { type: Number },
        baseSalary: { type: Number },
        bonus: { type: Number },
        stocks: { type: Number }
    },
    benefits: [String],
    selectionProcess: [{
        roundNumber: Number,
        roundName: String,
        description: String,
        duration: String
    }],
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
    registeredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile' }],
    shortlistedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile' }],
    selectedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile' }],
    coordinator: { type: String },
    contactEmail: { type: String },
    totalPositions: { type: Number },
    workLocation: { type: String },
    bond: { type: String },
    probationPeriod: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('PlacementDrive', placementDriveSchema);
