const PlacementDrive = require('../models/PlacementDrive');
const StudentProfile = require('../models/StudentProfile');

const calculateReadinessScore = (profile) => {
    let score = 0;
    // CGPA contributes up to 40 points
    score += (profile.cgpa / 10) * 40;

    // Skills contribute up to 40 points
    const skillPoints = profile.skills.length * 10;
    score += Math.min(skillPoints, 40);

    // Backlogs penalty
    if (profile.backlogs > 0) score -= 20;

    return Math.max(0, Math.min(100, score));
};

const getRecommendations = async (profile) => {
    const drives = await PlacementDrive.find({
        'eligibility.minCgpa': { $lte: profile.cgpa },
        'eligibility.maxBacklogs': { $gte: profile.backlogs }
    });

    return drives.map(drive => ({
        company: drive.companyName,
        matchProbability: calculateMatch(profile, drive),
        reasoning: `Matched based on CGPA ${profile.cgpa} and skills.`
    }));
};

const calculateMatch = (profile, drive) => {
    // Simple logic for matching skills
    const profileSkills = profile.skills.map(s => s.name.toLowerCase());
    const matchedSkills = drive.requirements.filter(req => profileSkills.includes(req.toLowerCase()));

    let baseMatch = 60;
    if (matchedSkills.length > 0) baseMatch += 20;
    if (profile.cgpa > drive.eligibility.minCgpa + 1) baseMatch += 10;

    return Math.min(100, baseMatch);
};

module.exports = { calculateReadinessScore, getRecommendations };
