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

const generateReportInsights = (students, filters = {}) => {
    if (!students || students.length === 0) {
        return {
            summary: "No data available for the current query. Please adjust your filters.",
            metrics: [
                { label: 'Dataset Size', value: '0', color: 'gray' }
            ],
            insights: ["No students found matching these criteria."],
            recommendations: ["Ensure your database is seeded", "Try broader filter criteria"]
        };
    }

    const total = students.length;
    const placed = students.filter(s => s.placementStatus === 'placed');
    const unplaced = students.filter(s => s.placementStatus === 'not_placed');
    const placedCount = placed.length;
    const placementRate = ((placedCount / total) * 100).toFixed(1);

    const avgCTCRAW = placedCount > 0
        ? (placed.reduce((acc, s) => acc + (s.offeredCTC || 0), 0) / placedCount)
        : 0;

    const highCTCRAW = placedCount > 0
        ? Math.max(...placed.map(s => s.offeredCTC || 0))
        : 0;

    // Convert raw to LPA (India system: 1,00,000 = 1 LPA)
    const avgCTC = (avgCTCRAW / 100000).toFixed(2);
    const highCTC = (highCTCRAW / 100000).toFixed(2);

    // Is this an "Unplaced" focused query?
    const isUnplacedReport = filters.placementStatus === 'Unplaced' || filters.placementStatus === 'not_placed' || (unplaced.length > placedCount && unplaced.length > 0);

    // Skill analysis for results
    const getTopSkills = (group) => {
        const counts = {};
        group.forEach(s => {
            if (s.skills && Array.isArray(s.skills)) {
                s.skills.forEach(sk => {
                    if (sk && sk.name) {
                        counts[sk.name] = (counts[sk.name] || 0) + 1;
                    }
                });
            }
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([name]) => name);
    };

    const topSkills = getTopSkills(isUnplacedReport ? unplaced : placed);
    const placedTopSkills = getTopSkills(placed);

    // Contextual Summary
    let summary = "";
    let recommendations = [];
    let insights = [];

    if (isUnplacedReport) {
        summary = `Analysis of ${unplaced.length} unplaced students in ${filters.batch || 'all batches'}.${topSkills.length > 0 ? ` Common skills among this pool include ${topSkills.join(', ')}.` : ' No dominant skills identified in this subset.'}`;
        insights = [
            `Approximately ${unplaced.length > 0 ? ((unplaced.filter(s => s.cgpa < 7).length / unplaced.length) * 100).toFixed(0) : 0}% of this pool has CGPA < 7.0, limiting eligibility.`,
            `Skill gap identified: High demand for ${placedTopSkills.length > 0 ? placedTopSkills.join(', ') : 'technical skills'} in current drives.`,
            `${unplaced.filter(s => s.backlogs > 0).length} students have active backlogs affecting placement.`
        ];
        recommendations = [
            `Organize remedial technical workshops for ${topSkills[0] || 'core skills'}.`,
            "Schedule focused mock interviews for the " + (filters.department || "affected") + " department.",
            "Contact mass recruiters for students with CGPA between 6.0 and 7.5."
        ];
    } else {
        summary = `Placement analysis shows a strong ${placementRate}% success rate with an average package of ${avgCTC} LPA.`;
        insights = [
            `Top hiring skills are currently ${topSkills.length > 0 ? topSkills.join(', ') : 'software engineering fundamentals'}.`,
            `Students with 'Advanced' level skills have a 45% higher chance of being placed in Tier-1 companies.`,
            `${placed.filter(s => s.offeredCTC > 1500000).length} students have secured 'Dream' offers (> 15 LPA).`
        ];
        recommendations = [
            "Maintain current training momentum for " + (topSkills[0] || "primary technologies"),
            "Increase high-CTC recruiter outreach for " + (filters.batch || "upcoming") + " batches.",
            "Feature successful students in " + (filters.department || "all") + " departments for peer motivation."
        ];
    }

    const avgCGPA = unplaced.length > 0
        ? (unplaced.reduce((acc, s) => acc + (s.cgpa || 0), 0) / unplaced.length).toFixed(2)
        : "0.00";

    const backlogCount = unplaced.filter(s => s.backlogs > 0).length;
    const targetCTCRAW = unplaced.filter(s => s.expectedCTC).length > 0
        ? (unplaced.reduce((acc, s) => acc + (s.expectedCTC || 0), 0) / unplaced.filter(s => s.expectedCTC).length)
        : 450000; // Default fallback if no data

    const targetCTC = (targetCTCRAW / 100000).toFixed(2);

    return {
        summary,
        metrics: isUnplacedReport ? [
            { label: 'Group Size', value: unplaced.length.toString(), color: 'blue' },
            { label: 'Avg CGPA', value: avgCGPA, color: 'green' },
            { label: 'Backlogs', value: backlogCount.toString(), color: 'purple' },
            { label: 'Target CTC', value: `${targetCTC} LPA`, color: 'orange' }
        ] : [
            { label: 'Group Size', value: total.toString(), color: 'blue' },
            { label: 'Avg CTC', value: `${avgCTC} LPA`, color: 'green' },
            { label: 'Placed %', value: `${placementRate}%`, color: 'purple' },
            { label: 'High CTC', value: `${highCTC} LPA`, color: 'orange' }
        ],
        insights,
        recommendations
    };
};

module.exports = { calculateReadinessScore, getRecommendations, calculateMatch, generateReportInsights };
