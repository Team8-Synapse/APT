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

// New endpoint for comprehensive analytics data across different datasets
router.get('/analytics-dataset', async (req, res) => {
    try {
        const studentCsvPath = path.join(__dirname, '../data/students.csv');
        const testCsvPath = path.join(__dirname, '../data/test_dataset.csv');

        // Helper to read and parse CSV
        const parseCsv = (filePath) => {
            if (!fs.existsSync(filePath)) return [];
            const content = fs.readFileSync(filePath, 'utf-8');
            const lines = content.split('\n').filter(line => line.trim());
            if (lines.length === 0) return [];
            const headers = lines[0].split(',').map(h => h.trim());
            return lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim());
                const obj = {};
                headers.forEach((h, i) => obj[h] = values[i]);
                return obj;
            });
        };

        // Helper to determine company tier and mock CTC
        const getCompanyInference = (companyName) => {
            if (!companyName || companyName === 'TBD') return { tier: 'N/A', ctc: 0 };
            const name = companyName.toLowerCase();
            if (name.includes('google') || name.includes('amazon') || name.includes('microsoft') || name.includes('apple') || name.includes('meta')) {
                return { tier: 'Super Dream', ctc: 25 + Math.floor(Math.random() * 15) };
            }
            if (name.includes('oracle') || name.includes('accenture') || name.includes('tcs') || name.includes('infosys') || name.includes('wipro')) {
                return { tier: 'Dream', ctc: 8 + Math.floor(Math.random() * 7) };
            }
            return { tier: 'Regular', ctc: 4 + Math.floor(Math.random() * 4) };
        };

        const studentsRaw = parseCsv(studentCsvPath);
        const testDataRaw = parseCsv(testCsvPath);

        // Map students.csv data (2026/2027)
        const mapped2026 = studentsRaw.map(s => {
            const inference = getCompanyInference(s.company);
            return {
                roll_no: s.roll_no,
                full_name: s.full_name,
                email: s.email,
                dept_code: s.dept_code,
                section: s.section,
                batch_year: parseInt(s.batch_year),
                cgpa: parseFloat(s.cgpa) || 0,
                backlogs: Math.random() > 0.9 ? Math.floor(Math.random() * 3) : 0, // Mock backlogs
                placement_status: s.placement_status,
                company: s.placement_status === 'Placed' ? (s.company || 'TBD') : null,
                ctc: inference.ctc,
                tier: inference.tier
            };
        });

        // Map test_dataset.csv data (Treat as 2025)
        const mapped2025 = testDataRaw.map(s => {
            // Extract dept from roll number
            let dept = 'CSE';
            if (s.roll_number?.includes('ECE')) dept = 'ECE';
            else if (s.roll_number?.includes('EEE')) dept = 'EEE';
            else if (s.roll_number?.includes('ME')) dept = 'MEC';
            else if (s.roll_number?.includes('AIE')) dept = 'AIE';
            else if (s.roll_number?.includes('AIDS')) dept = 'AIDS';
            else if (s.roll_number?.includes('ELC')) dept = 'ELC';

            const inference = getCompanyInference(s.company);

            return {
                roll_no: s.roll_number,
                full_name: s.name,
                email: s.email,
                dept_code: dept,
                section: 'A',
                batch_year: 2025,
                cgpa: 7.0 + (Math.random() * 2.5),
                backlogs: Math.random() > 0.95 ? 1 : 0, // Mock backlogs
                placement_status: s.placed === 'Yes' ? 'Placed' : 'Not Placed',
                company: s.company || null,
                ctc: inference.ctc,
                tier: inference.tier
            };
        });

        res.json([...mapped2026, ...mapped2025]);
    } catch (err) {
        console.error('Analytics dataset v2 error:', err);
        res.status(500).json({ error: err.message });
    }
});


// Get admin statistics
router.get('/stats', async (req, res) => {
    try {
        const batchFilter = '2026';
        const driveCount = await PlacementDrive.countDocuments();
        const alumniCount = await AlumniInsight.countDocuments();
        const applicationCount = await Application.countDocuments();

        // Read CSV file for student stats
        const csvPath = path.join(__dirname, '../data/students.csv');
        let students = [];
        try {
            const csvContent = fs.readFileSync(csvPath, 'utf-8');
            const lines = csvContent.split('\n').filter(line => line.trim());
            const headers = lines[0].split(',').map(h => h.trim());

            students = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim());
                const student = {};
                headers.forEach((header, i) => {
                    student[header] = values[i] || '';
                });
                return {
                    batch: student.batch_year,
                    department: student.dept_code,
                    placementStatus: (student.placement_status || '').toLowerCase().replace(' ', '_'),
                    cgpa: parseFloat(student.cgpa) || 0
                };
            });
        } catch (csvErr) {
            console.error('Error reading CSV for stats:', csvErr);
        }

        // Filter for 2026 batch
        const filteredStudents = students.filter(s => s.batch === batchFilter);

        const studentCount = filteredStudents.length;
        const placedStudents = filteredStudents.filter(s => s.placementStatus === 'placed').length;
        const inProcessStudents = filteredStudents.filter(s => s.placementStatus === 'in_process').length;

        // Department-wise statistics for 2026 batch from CSV
        const deptMap = {};
        filteredStudents.forEach(s => {
            if (!deptMap[s.department]) {
                deptMap[s.department] = { count: 0, placed: 0, totalCgpa: 0 };
            }
            deptMap[s.department].count++;
            if (s.placementStatus === 'placed') {
                deptMap[s.department].placed++;
            }
            deptMap[s.department].totalCgpa += s.cgpa;
        });

        const departmentStats = Object.keys(deptMap).map(dept => ({
            _id: dept,
            count: deptMap[dept].count,
            placed: deptMap[dept].placed,
            avgCgpa: deptMap[dept].totalCgpa / deptMap[dept].count,
            placementPercentage: (deptMap[dept].placed / deptMap[dept].count) * 100
        })).sort((a, b) => b.placementPercentage - a.placementPercentage);

        // Placement status distribution for 2026 batch
        const placementStatusCounts = {};
        filteredStudents.forEach(s => {
            placementStatusCounts[s.placementStatus] = (placementStatusCounts[s.placementStatus] || 0) + 1;
        });
        const placementStats = Object.keys(placementStatusCounts).map(status => ({
            _id: status,
            count: placementStatusCounts[status]
        }));

        // CTC statistics (still from DB as CSV doesn't have it)
        const ctcStatsDb = await StudentProfile.aggregate([
            { $match: { batch: batchFilter, placementStatus: 'placed', offeredCTC: { $exists: true } } },
            {
                $group: {
                    _id: null,
                    avgCTC: { $avg: '$offeredCTC' },
                    maxCTC: { $max: '$offeredCTC' },
                    minCTC: { $min: '$offeredCTC' }
                }
            }
        ]);

        const recentDrives = await PlacementDrive.find()
            .sort({ date: -1 })
            .limit(5)
            .select('companyName jobProfile date status ctcDetails');

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
            ctcStats: ctcStatsDb[0] || { avgCTC: 0, maxCTC: 1800000, minCTC: 350000 } // fallback values for demo if no DB data
        });
    } catch (err) {
        console.error('Stats error:', err);
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
