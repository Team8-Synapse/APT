const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const PlacementDrive = require('../models/PlacementDrive');
const StudentProfile = require('../models/StudentProfile');

// Get all applications for a student
router.get('/my-applications/:userId', async (req, res) => {
    try {
        const studentProfile = await StudentProfile.findOne({ userId: req.params.userId });
        if (!studentProfile) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        const applications = await Application.find({ studentId: studentProfile._id })
            .populate('driveId')
            .sort({ appliedDate: -1 });

        res.json(applications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Apply to a drive
router.post('/apply', async (req, res) => {
    try {
        const { userId, driveId } = req.body;

        const studentProfile = await StudentProfile.findOne({ userId });
        if (!studentProfile) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            studentId: studentProfile._id,
            driveId
        });
        if (existingApplication) {
            return res.status(400).json({ error: 'Already applied to this drive' });
        }

        // Get drive and check eligibility
        const drive = await PlacementDrive.findById(driveId);
        if (!drive) {
            return res.status(404).json({ error: 'Drive not found' });
        }

        // Check eligibility
        if (drive.eligibility) {
            if (drive.eligibility.minCgpa && studentProfile.cgpa < drive.eligibility.minCgpa) {
                return res.status(400).json({ error: `Minimum CGPA requirement: ${drive.eligibility.minCgpa}` });
            }
            if (drive.eligibility.maxBacklogs !== undefined && studentProfile.backlogs > drive.eligibility.maxBacklogs) {
                return res.status(400).json({ error: `Maximum backlogs allowed: ${drive.eligibility.maxBacklogs}` });
            }
            if (drive.eligibility.allowedDepartments && drive.eligibility.allowedDepartments.length > 0) {
                if (!drive.eligibility.allowedDepartments.includes(studentProfile.department)) {
                    return res.status(400).json({ error: 'Your department is not eligible for this drive' });
                }
            }
        }

        const application = new Application({
            studentId: studentProfile._id,
            driveId,
            status: 'applied',
            appliedDate: new Date()
        });

        await application.save();

        // Add student to registered list
        await PlacementDrive.findByIdAndUpdate(driveId, {
            $addToSet: { registeredStudents: studentProfile._id }
        });

        res.status(201).json({ message: 'Applied successfully', application });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Withdraw application
router.delete('/withdraw/:applicationId', async (req, res) => {
    try {
        const application = await Application.findById(req.params.applicationId);
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        if (application.status !== 'applied') {
            return res.status(400).json({ error: 'Cannot withdraw after shortlisting' });
        }

        await PlacementDrive.findByIdAndUpdate(application.driveId, {
            $pull: { registeredStudents: application.studentId }
        });

        await Application.findByIdAndDelete(req.params.applicationId);

        res.json({ message: 'Application withdrawn successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Respond to Offer (Accept/Decline)
router.patch('/respond-offer/:applicationId', async (req, res) => {
    try {
        const { status } = req.body; // 'accepted' or 'declined'
        if (!['accepted', 'declined'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const application = await Application.findById(req.params.applicationId).populate('driveId');
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        if (application.status !== 'offered') {
            return res.status(400).json({ error: 'Application is not in offered state' });
        }

        // Update application status
        application.status = status;
        await application.save();

        if (status === 'accepted') {
            // Update Student Profile
            await StudentProfile.findByIdAndUpdate(application.studentId, {
                placementStatus: 'placed',
                offeredCompany: application.driveId.companyName,
                offeredCTC: application.offeredCTC || application.driveId.ctcDetails.ctc
            });

            // Add to selected students in Drive
            await PlacementDrive.findByIdAndUpdate(application.driveId._id, {
                $addToSet: { selectedStudents: application.studentId }
            });
        }

        res.json({ message: `Offer ${status} successfully`, application });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get application status timeline
router.get('/timeline/:applicationId', async (req, res) => {
    try {
        const application = await Application.findById(req.params.applicationId)
            .populate('driveId');

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        const timeline = [
            { status: 'applied', date: application.appliedDate, completed: true }
        ];

        if (application.rounds && application.rounds.length > 0) {
            application.rounds.forEach(round => {
                timeline.push({
                    status: round.roundName,
                    date: round.date,
                    completed: round.status === 'passed',
                    failed: round.status === 'failed'
                });
            });
        }

        res.json({ application, timeline });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get application statistics for a student
router.get('/stats/:userId', async (req, res) => {
    try {
        const studentProfile = await StudentProfile.findOne({ userId: req.params.userId });
        if (!studentProfile) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        const applications = await Application.find({ studentId: studentProfile._id });

        const stats = {
            total: applications.length,
            applied: applications.filter(a => a.status === 'applied').length,
            shortlisted: applications.filter(a => a.status === 'shortlisted').length,
            inProgress: applications.filter(a => ['round1', 'round2', 'round3', 'hr_round'].includes(a.status)).length,
            offered: applications.filter(a => ['offered', 'accepted'].includes(a.status)).length,
            rejected: applications.filter(a => a.status === 'rejected').length,
            accepted: applications.filter(a => a.status === 'accepted').length
        };

        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
