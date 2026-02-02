const mongoose = require('../services/mockMongoose');

const studentProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rollNumber: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    department: { type: String, required: true },
    course: { type: String, default: 'B.Tech' },
    section: { type: String, default: 'A' },
    cgpa: { type: Number, required: true },
    batch: { type: String, required: true },
    backlogs: { type: Number, default: 0 },
    skills: [{
        name: { type: String },
        level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] }
    }],
    certifications: [String],
    isEligible: { type: Boolean, default: true },
    linkedIn: { type: String },
    github: { type: String },
    resumeUrl: { type: String },
    portfolio: { type: String },
    // Placement tracking
    placementStatus: {
        type: String,
        enum: ['not_placed', 'in_process', 'placed', 'opted_out'],
        default: 'not_placed'
    },
    offeredCompany: { type: String },
    offeredRole: { type: String },
    offeredCTC: { type: Number },
    offerDate: { type: Date },
    // Additional info
    tenthPercentage: { type: Number },
    twelfthPercentage: { type: Number },
    diplomaPercentage: { type: Number },
    gap: { type: Number, default: 0 },
    internships: [{
        company: String,
        role: String,
        duration: String,
        description: String
    }],
    projects: [{
        title: String,
        description: String,
        technologies: [String],
        link: String
    }],
    achievements: [String],
    preferredRoles: [String],
    preferredLocations: [String],
    expectedCTC: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
