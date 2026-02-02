const express = require('express');
const router = express.Router();
const StudentProfile = require('../models/StudentProfile');
const PlacementDrive = require('../models/PlacementDrive');
const Application = require('../models/Application');

// Get student profile
router.get('/profile/:userId', async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ userId: req.params.userId });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update student profile
router.put('/profile/:userId', async (req, res) => {
    try {
        const profile = await StudentProfile.findOneAndUpdate(
            { userId: req.params.userId },
            req.body,
            { new: true, runValidators: true }
        );
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get eligible drives for a student
router.get('/eligibility', async (req, res) => {
    try {
        // For now, return all upcoming drives
        const drives = await PlacementDrive.find({
            status: { $in: ['upcoming', 'ongoing'] }
        }).sort({ date: 1 });

        res.json(drives);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get eligible drives for a specific student with application status
router.get('/eligible-drives/:userId', async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ userId: req.params.userId });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const allDrives = await PlacementDrive.find({
            status: { $in: ['upcoming', 'ongoing'] }
        }).sort({ date: 1 });

        // Get student's applications
        const applications = await Application.find({ studentId: profile._id });
        const appliedDriveIds = applications.map(a => a.driveId.toString());

        const drivesWithEligibility = allDrives.map(drive => {
            const driveObj = drive.toObject();

            // Check eligibility
            let isEligible = true;
            let reasons = [];

            if (drive.eligibility) {
                if (drive.eligibility.minCgpa && profile.cgpa < drive.eligibility.minCgpa) {
                    isEligible = false;
                    reasons.push(`CGPA below ${drive.eligibility.minCgpa}`);
                }
                if (drive.eligibility.maxBacklogs !== undefined && profile.backlogs > drive.eligibility.maxBacklogs) {
                    isEligible = false;
                    reasons.push(`Backlogs exceed ${drive.eligibility.maxBacklogs}`);
                }
                if (drive.eligibility.allowedDepartments && drive.eligibility.allowedDepartments.length > 0) {
                    if (!drive.eligibility.allowedDepartments.includes(profile.department)) {
                        isEligible = false;
                        reasons.push(`${profile.department} not eligible`);
                    }
                }
            }

            const hasApplied = appliedDriveIds.includes(drive._id.toString());
            const application = applications.find(a => a.driveId.toString() === drive._id.toString());

            return {
                ...driveObj,
                isEligible,
                eligibilityReasons: reasons,
                hasApplied,
                applicationStatus: application?.status,
                applicationId: application?._id
            };
        });

        res.json(drivesWithEligibility);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get dashboard stats for student
router.get('/dashboard-stats/:userId', async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ userId: req.params.userId });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const applications = await Application.find({ studentId: profile._id });

        // Calculate readiness score based on profile completeness and stats
        let readinessScore = 0;

        // Profile completeness (40%)
        let profilePoints = 0;
        if (profile.skills && profile.skills.length > 0) profilePoints += 10;
        if (profile.skills && profile.skills.length >= 3) profilePoints += 5;
        if (profile.certifications && profile.certifications.length > 0) profilePoints += 5;
        if (profile.projects && profile.projects.length > 0) profilePoints += 5;
        if (profile.internships && profile.internships.length > 0) profilePoints += 10;
        if (profile.linkedIn) profilePoints += 3;
        if (profile.github) profilePoints += 2;
        readinessScore += profilePoints;

        // CGPA score (30%)
        if (profile.cgpa >= 9) readinessScore += 30;
        else if (profile.cgpa >= 8) readinessScore += 25;
        else if (profile.cgpa >= 7) readinessScore += 20;
        else readinessScore += 10;

        // Activity score (30%)
        if (applications.length >= 5) readinessScore += 15;
        else if (applications.length >= 3) readinessScore += 10;
        else if (applications.length >= 1) readinessScore += 5;

        const shortlisted = applications.filter(a => ['shortlisted', 'round1', 'round2', 'round3', 'hr_round', 'offered'].includes(a.status));
        if (shortlisted.length > 0) readinessScore += 15;

        // Upcoming drives count
        const upcomingDrives = await PlacementDrive.countDocuments({
            status: 'upcoming',
            date: { $gte: new Date() }
        });

        // Eligible drives count
        const allUpcomingDrives = await PlacementDrive.find({ status: 'upcoming' });
        let eligibleCount = 0;
        allUpcomingDrives.forEach(drive => {
            let eligible = true;
            if (drive.eligibility) {
                if (drive.eligibility.minCgpa && profile.cgpa < drive.eligibility.minCgpa) eligible = false;
                if (drive.eligibility.maxBacklogs !== undefined && profile.backlogs > drive.eligibility.maxBacklogs) eligible = false;
                if (drive.eligibility.allowedDepartments && drive.eligibility.allowedDepartments.length > 0) {
                    if (!drive.eligibility.allowedDepartments.includes(profile.department)) eligible = false;
                }
            }
            if (eligible) eligibleCount++;
        });

        res.json({
            readinessScore: Math.min(readinessScore, 100),
            profile: {
                name: `${profile.firstName} ${profile.lastName}`,
                rollNumber: profile.rollNumber,
                department: profile.department,
                cgpa: profile.cgpa,
                placementStatus: profile.placementStatus,
                offeredCompany: profile.offeredCompany,
                offeredCTC: profile.offeredCTC
            },
            applications: {
                total: applications.length,
                inProgress: applications.filter(a => ['shortlisted', 'round1', 'round2', 'round3', 'hr_round'].includes(a.status)).length,
                offered: applications.filter(a => a.status === 'offered').length,
                rejected: applications.filter(a => a.status === 'rejected').length
            },
            drives: {
                upcoming: upcomingDrives,
                eligible: eligibleCount
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all drives (for student view)
router.get('/drives', async (req, res) => {
    try {
        const drives = await PlacementDrive.find()
            .sort({ date: 1 })
            .select('-registeredStudents -shortlistedStudents -selectedStudents');
        res.json(drives);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get drive details
router.get('/drive/:id', async (req, res) => {
    try {
        const drive = await PlacementDrive.findById(req.params.id);
        if (!drive) {
            return res.status(404).json({ error: 'Drive not found' });
        }
        res.json(drive);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
