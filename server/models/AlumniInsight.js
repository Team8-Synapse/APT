const mongoose = require('mongoose');

const alumniInsightSchema = new mongoose.Schema({
    company: { type: String, required: true },
    year: { type: Number, required: true },
    alumniName: { type: String, required: true },
    experience: { type: String, required: true },
    rounds: [{
        name: { type: String },
        difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
        topics: [String]
    }],
    consentForContact: { type: Boolean, default: false },
    alumniEmail: { type: String, select: false } // Hidden unless consent is handled
}, { timestamps: true });

module.exports = mongoose.model('AlumniInsight', alumniInsightSchema);
