const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const PlacementDrive = require('../models/PlacementDrive');
const AlumniInsight = require('../models/AlumniInsight');

exports.getDashboardStats = async (req, res) => {
    try {
        const studentCount = await User.countDocuments({ role: 'student' });
        const driveCount = await PlacementDrive.countDocuments();
        const alumniCount = await AlumniInsight.countDocuments();
        const recentDrives = await PlacementDrive.find().sort({ date: -1 }).limit(5);

        res.send({
            studentCount,
            driveCount,
            alumniCount,
            recentDrives
        });
    } catch (e) {
        res.status(500).send(e);
    }
};

exports.shortlistStudents = async (req, res) => {
    try {
        const { minCgpa, allowedBatches, maxBacklogs, requiredSkills } = req.body;

        let query = {
            cgpa: { $gte: minCgpa || 0 },
            backlogs: { $lte: maxBacklogs || 0 }
        };

        if (allowedBatches && allowedBatches.length > 0) {
            query.batch = { $in: allowedBatches };
        }

        if (requiredSkills && requiredSkills.length > 0) {
            query['skills.name'] = { $all: requiredSkills.map(s => new RegExp(s, 'i')) };
        }

        const shortlisted = await StudentProfile.find(query).populate('userId', 'email');
        res.send(shortlisted);
    } catch (e) {
        res.status(500).send(e);
    }
};

exports.addPlacementDrive = async (req, res) => {
    try {
        const drive = new PlacementDrive(req.body);
        await drive.save();
        res.status(201).send(drive);
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.deleteDrive = async (req, res) => {
    try {
        const drive = await PlacementDrive.findByIdAndDelete(req.params.id);
        if (!drive) return res.status(404).send();
        res.send(drive);
    } catch (e) {
        res.status(500).send(e);
    }
};
