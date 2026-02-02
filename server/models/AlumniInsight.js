const mongoose = require('../services/mockMongoose');

const alumniInsightSchema = new mongoose.Schema({
    company: { type: String, required: true },
    companyLogo: { type: String },
    year: { type: Number, required: true },
    alumniName: { type: String, required: true },
    alumniEmail: { type: String },
    linkedIn: { type: String },
    currentRole: { type: String },
    department: { type: String },
    batch: { type: String },
    experience: { type: String, required: true },
    overallRating: { type: Number, min: 1, max: 5 },
    difficultyLevel: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Very Hard'] },
    preparationTips: [String],
    resourcesUsed: [String],
    rounds: [{
        name: { type: String },
        type: { type: String, enum: ['Online Test', 'Coding', 'Technical', 'HR', 'Group Discussion', 'Case Study'] },
        difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
        duration: { type: String },
        topics: [String],
        questions: [String],
        tips: { type: String }
    }],
    offerDetails: {
        role: String,
        ctc: Number,
        location: String,
        joiningBonus: Number
    },
    interviewDate: { type: Date },
    wouldRecommend: { type: Boolean, default: true },
    consentForContact: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('AlumniInsight', alumniInsightSchema);
