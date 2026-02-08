const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const StudentProfile = require('../models/StudentProfile');
const PlacementDrive = require('../models/PlacementDrive');
const AlumniInsight = require('../models/AlumniInsight');
const Application = require('../models/Application');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Get admin statistics
router.get('/stats', async (req, res) => {
    try {
        const studentCount = await StudentProfile.countDocuments();
        const driveCount = await PlacementDrive.countDocuments();
        const alumniCount = await AlumniInsight.countDocuments();
        const applicationCount = await Application.countDocuments();

        const placedStudents = await StudentProfile.countDocuments({ placementStatus: 'placed' });
        const inProcessStudents = await StudentProfile.countDocuments({ placementStatus: 'in_process' });

        const recentDrives = await PlacementDrive.find()
            .sort({ date: -1 })
            .limit(5)
            .select('companyName jobProfile date status ctcDetails');

        // Department-wise statistics
        const departmentStats = await StudentProfile.aggregate([
            { $group: { _id: '$department', count: { $sum: 1 }, avgCgpa: { $avg: '$cgpa' } } }
        ]);

        // Placement status distribution
        const placementStats = await StudentProfile.aggregate([
            { $group: { _id: '$placementStatus', count: { $sum: 1 } } }
        ]);

        // CTC statistics for placed students
        const ctcStats = await StudentProfile.aggregate([
            { $match: { placementStatus: 'placed', offeredCTC: { $exists: true } } },
            {
                $group: {
                    _id: null,
                    avgCTC: { $avg: '$offeredCTC' },
                    maxCTC: { $max: '$offeredCTC' },
                    minCTC: { $min: '$offeredCTC' }
                }
            }
        ]);

        res.json({
            studentCount,
            driveCount,
            alumniCount,
            applicationCount,
            placedStudents,
            inProcessStudents,
            placementPercentage: studentCount > 0 ? ((placedStudents / studentCount) * 100).toFixed(1) : 0,
            recentDrives,
            departmentStats,
            placementStats,
            ctcStats: ctcStats[0] || { avgCTC: 0, maxCTC: 0, minCTC: 0 }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all students with filters - reads from CSV file
// Get all students with filters - reads from CSV file
router.get('/students', async (req, res) => {
    try {
        const { department, minCgpa, maxCgpa, placementStatus, batch, search, page = 1, limit = 50 } = req.query;

        // Read CSV file
        const csvPath = path.join(__dirname, '../data/students.csv');
        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        const lines = csvContent.split('\n').filter(line => line.trim());

        // Parse header
        const headers = lines[0].split(',').map(h => h.trim());

        // Parse all students
        let students = lines.slice(1).map((line, index) => {
            const values = line.split(',').map(v => v.trim());
            const student = {};
            headers.forEach((header, i) => {
                student[header] = values[i] || '';
            });

            // Standard mapped object
            const mappedStudent = {
                _id: `csv_${index}`,
                rollNumber: student.roll_no,
                firstName: student.full_name?.split(' ')[0] || '',
                lastName: student.full_name?.split(' ').slice(1).join(' ') || '',
                email: student.email,
                department: student.dept_code,
                section: student.section,
                batch: student.batch_year,
                cgpa: parseFloat(student.cgpa) || 0,
                backlogs: parseInt(student.backlogs) || 0,
                placementStatus: student.placement_status === 'Placed' ? 'placed' :
                    student.placement_status === 'In Process' ? 'in_process' : 'not_placed',
                // Preserve all original CSV data
                originalData: student
            };
            return mappedStudent;
        });

        // Apply filters
        if (department) {
            students = students.filter(s => s.department === department);
        }
        if (batch) {
            students = students.filter(s => s.batch === batch);
        }
        if (placementStatus) {
            students = students.filter(s => s.placementStatus === placementStatus);
        }
        if (minCgpa) {
            students = students.filter(s => s.cgpa >= parseFloat(minCgpa));
        }
        if (maxCgpa) {
            students = students.filter(s => s.cgpa <= parseFloat(maxCgpa));
        }

        // Robust Search Implementation
        if (search) {
            const searchLower = search.toLowerCase().replace(/\s+/g, '');
            students = students.filter(s => {
                // Search in mapped fields
                const mappedValues = [
                    s.firstName, s.lastName, s.rollNumber, s.email,
                    s.department, s.batch, s.placementStatus
                ].map(v => String(v || '').toLowerCase().replace(/\s+/g, ''));

                if (mappedValues.some(v => v.includes(searchLower))) return true;

                // Search in ALL original CSV columns
                const originalValues = Object.values(s.originalData)
                    .map(v => String(v || '').toLowerCase().replace(/\s+/g, ''));

                return originalValues.some(v => v.includes(searchLower));
            });
        }

        // Pagination
        const total = students.length;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const paginatedStudents = students.slice(skip, skip + parseInt(limit));

        res.json({
            students: paginatedStudents,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (err) {
        console.error('Error reading CSV:', err);
        res.status(500).json({ error: err.message });
    }
});

// Shortlist students based on criteria
router.post('/shortlist', async (req, res) => {
    try {
        const { minCgpa = 0, maxBacklogs = 0, departments, skills } = req.body;

        const query = {
            cgpa: { $gte: parseFloat(minCgpa) },
            backlogs: { $lte: parseInt(maxBacklogs) }
        };

        if (departments && departments.length > 0) {
            query.department = { $in: departments };
        }

        if (skills && skills.length > 0) {
            query['skills.name'] = { $in: skills };
        }

        const students = await StudentProfile.find(query)
            .populate('userId', 'email')
            .sort({ cgpa: -1 });

        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get company-wise placement statistics
router.get('/company-stats', async (req, res) => {
    try {
        const companyStats = await StudentProfile.aggregate([
            { $match: { placementStatus: 'placed', offeredCompany: { $exists: true } } },
            {
                $group: {
                    _id: '$offeredCompany',
                    count: { $sum: 1 },
                    avgCTC: { $avg: '$offeredCTC' },
                    roles: { $addToSet: '$offeredRole' }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json(companyStats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get drive analytics
router.get('/drive-analytics', async (req, res) => {
    try {
        const drives = await PlacementDrive.find()
            .select('companyName date status registeredStudents selectedStudents ctcDetails');

        const analytics = drives.map(drive => ({
            company: drive.companyName,
            date: drive.date,
            status: drive.status,
            registered: drive.registeredStudents?.length || 0,
            selected: drive.selectedStudents?.length || 0,
            ctc: drive.ctcDetails?.ctc || 0,
            selectionRate: drive.registeredStudents?.length > 0
                ? ((drive.selectedStudents?.length || 0) / drive.registeredStudents.length * 100).toFixed(1)
                : 0
        }));

        res.json(analytics);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Update student in CSV
router.put('/student/csv/:rollNo', async (req, res) => {
    try {
        const { rollNo } = req.params;
        const updatedData = req.body;

        const csvPath = path.join(__dirname, '../data/students.csv');
        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        const lines = csvContent.split('\n');
        const headerLine = lines[0];
        const headers = headerLine.split(',').map(h => h.trim());

        // Find indices
        const rollIdx = headers.indexOf('roll_no');
        if (rollIdx === -1) throw new Error('Roll number column not found in CSV');

        let studentFound = false;
        const newLines = lines.map((line, index) => {
            if (index === 0 || !line.trim()) return line; // Skip header and empty lines

            const values = line.split(',');
            // Handle cases where values might contain commas (naive split, but consistent with existing read logic)
            // Ideally should use a CSV parser, but sticking to existing pattern for consistency

            if (values[rollIdx]?.trim() === rollNo) {
                studentFound = true;
                // Update values
                // Map frontend fields back to CSV columns
                const originalData = updatedData.originalData || {};

                // Helper to safely set value
                const setVal = (colName, val) => {
                    const idx = headers.indexOf(colName);
                    if (idx !== -1) values[idx] = val;
                };

                // Update core fields if present in request
                if (updatedData.firstName && updatedData.lastName) {
                    setVal('full_name', `${updatedData.firstName} ${updatedData.lastName}`);
                }
                if (updatedData.email) setVal('email', updatedData.email);
                if (updatedData.department) setVal('dept_code', updatedData.department);
                if (updatedData.batch) setVal('batch_year', updatedData.batch);
                if (updatedData.cgpa) setVal('cgpa', String(updatedData.cgpa));
                if (updatedData.backlogs !== undefined) setVal('backlogs', String(updatedData.backlogs));

                // Map status back
                if (updatedData.placementStatus) {
                    const statusMap = {
                        'placed': 'Placed',
                        'in_process': 'In Process',
                        'not_placed': 'Not Placed'
                    };
                    setVal('placement_status', statusMap[updatedData.placementStatus] || updatedData.placementStatus);
                }

                return values.join(',');
            }
            return line;
        });

        if (!studentFound) {
            return res.status(404).json({ error: 'Student not found in CSV' });
        }

        fs.writeFileSync(csvPath, newLines.join('\n'));
        res.json({ success: true, message: 'Student updated successfully' });

    } catch (err) {
        console.error('Error updating CSV:', err);
        res.status(500).json({ error: err.message });
    }
});

// Add/Update student
router.post('/student', async (req, res) => {
    try {
        const studentData = req.body;

        if (studentData._id) {
            // Update existing
            const student = await StudentProfile.findByIdAndUpdate(
                studentData._id,
                studentData,
                { new: true }
            );
            res.json(student);
        } else {
            // Create new user and profile
            const user = new User({
                email: studentData.email,
                password: 'password123',
                role: 'student'
            });
            await user.save();

            const student = new StudentProfile({
                ...studentData,
                userId: user._id
            });
            await student.save();
            res.status(201).json(student);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete student
router.delete('/student/:id', async (req, res) => {
    try {
        const student = await StudentProfile.findById(req.params.id);
        if (student) {
            await User.findByIdAndDelete(student.userId);
            await StudentProfile.findByIdAndDelete(req.params.id);
            await Application.deleteMany({ studentId: req.params.id });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CRUD for drives
router.get('/drives', async (req, res) => {
    try {
        const drives = await PlacementDrive.find().sort({ date: -1 });
        res.json(drives);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/drive', async (req, res) => {
    try {
        const driveData = req.body;
        let drive;
        let isNew = false;

        if (driveData._id) {
            drive = await PlacementDrive.findByIdAndUpdate(driveData._id, driveData, { new: true });
        } else {
            drive = new PlacementDrive(driveData);
            await drive.save();
            isNew = true;
        }

        // Create notification for students
        if (isNew) {
            const notification = new Notification({
                targetRole: 'student',
                title: 'New Placement Drive',
                message: `New placement drive announced: ${drive.companyName} for ${drive.jobProfile} role.`,
                type: 'drive',
                priority: 'high',
                relatedDrive: drive._id
            });
            await notification.save();
        } else {
            // Optional: Notify updates
            const notification = new Notification({
                targetRole: 'student',
                title: 'Placement Drive Updated',
                message: `Updates for ${drive.companyName} placement drive. Check details.`,
                type: 'drive',
                priority: 'medium',
                relatedDrive: drive._id
            });
            await notification.save();
        }

        res.status(isNew ? 201 : 200).json(drive);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/drive/:id', async (req, res) => {
    try {
        await PlacementDrive.findByIdAndDelete(req.params.id);
        await Application.deleteMany({ driveId: req.params.id });
        res.json({ message: 'Drive deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update application status (for admin)
router.patch('/application/:id', async (req, res) => {
    try {
        const { status, feedback, offeredCTC } = req.body;

        const updateData = { status };
        if (feedback) updateData.notes = feedback;
        if (offeredCTC) updateData.offeredCTC = offeredCTC;

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('driveId studentId');

        // Update student placement status if offered
        if (status === 'offered' || status === 'accepted') {
            await StudentProfile.findByIdAndUpdate(application.studentId._id, {
                placementStatus: status === 'accepted' ? 'placed' : 'in_process',
                offeredCompany: application.driveId.companyName,
                offeredRole: application.driveId.jobProfile,
                offeredCTC: offeredCTC || application.driveId.ctcDetails?.ctc
            });
        }

        // Create Notification
        try {
            await Notification.create({
                userId: application.studentId._id,
                title: `Status Update: ${application.driveId.companyName}`,
                message: `Your application status has been updated to ${status.replace('_', ' ').toUpperCase()}. Check your dashboard for details.`,
                type: status === 'offered' ? 'success' : status === 'rejected' ? 'error' : 'info',
                relatedDrive: application.driveId._id,
                targetRole: 'student'
            });
        } catch (notifErr) {
            console.error('Notification creation failed:', notifErr);
        }

        res.json(application);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all applications for a drive
router.get('/drive/:driveId/applications', async (req, res) => {
    try {
        const applications = await Application.find({ driveId: req.params.driveId })
            .populate('studentId')
            .sort({ appliedDate: -1 });

        res.json(applications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Alias for applicants (same as applications)
router.get('/drive/:driveId/applicants', async (req, res) => {
    try {
        const applications = await Application.find({ driveId: req.params.driveId })
            .populate('studentId')
            .sort({ appliedDate: -1 });

        res.json(applications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Export data as JSON (can be converted to CSV on frontend)
router.get('/export/students', async (req, res) => {
    try {
        const students = await StudentProfile.find()
            .populate('userId', 'email')
            .lean();

        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
