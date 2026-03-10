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

// Helper to parse CSV robustly
const parseStudentCsv = () => {
    try {
        const csvPath = path.join(__dirname, '../data/students.csv');
        console.log(`[CSV Helper] Trying path: ${csvPath}`);
        if (!fs.existsSync(csvPath)) {
            console.error(`[CSV Helper] File not found at: ${csvPath}`);
            return [];
        }
        const content = fs.readFileSync(csvPath, 'utf-8').replace(/^\uFEFF/, '');
        const lines = content.split('\n').filter(line => line.trim());
        console.log(`[CSV Helper] Headers line: ${lines[0]}`);
        if (lines.length < 2) return [];

        const headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(h => h.trim().replace(/^\uFEFF/, '').replace(/^"(.*)"$/, '$1'));
        return lines.slice(1).map((line, index) => {
            const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"(.*)"$/, '$1'));
            const student = {};
            headers.forEach((header, i) => student[header] = values[i] || '');

            return {
                _id: `csv_${index}`,
                rollNumber: student.roll_no,
                firstName: student.full_name?.split(' ')[0] || '',
                lastName: student.full_name?.split(' ').slice(1).join(' ') || '',
                email: student.email,
                department: student.dept_code,
                section: student.section,
                batch: String(student.batch_year || '').trim(),
                cgpa: parseFloat(student.cgpa) || 0,
                backlogs: parseInt(student.backlogs) || 0,
                placementStatus: (student.placement_status || '').toLowerCase().replace(' ', '_'),
                originalData: student
            };
        });
    } catch (err) {
        console.error('CSV Parse Helper Error:', err);
        return [];
    }
};

router.get('/analytics-dataset', async (req, res) => {
    try {
        const studentCsvPath = path.join(__dirname, '../data/students.csv');
        if (!fs.existsSync(studentCsvPath)) return res.json([]);

        const rawContent = fs.readFileSync(studentCsvPath, 'utf-8').replace(/^\uFEFF/, '');
        const lines = rawContent.split('\n').filter(line => line.trim());
        if (lines.length === 0) return res.json([]);

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"(.*)"$/, '$1'));
        const studentsRaw = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'));
            const obj = {};
            headers.forEach((h, i) => obj[h] = values[i]);
            return obj;
        });

        // Map all students from students.csv (2023-2027)
        const mappedData = studentsRaw.map(s => {
            return {
                roll_no: s.roll_no,
                full_name: s.full_name,
                email: s.email,
                dept_code: s.dept_code,
                section: s.section,
                batch_year: parseInt(s.batch_year),
                cgpa: parseFloat(s.cgpa) || 0,
                backlogs: parseInt(s.backlogs) || 0,
                placement_status: s.placement_status,
                company: s.placement_status === 'Placed' ? 'TBD' : null,
                ctc: s.placement_status === 'Placed' ? (12 + Math.floor(Math.random() * 20)) : 0,
                tier: s.placement_status === 'Placed' ? 'Dream' : 'N/A'
            };
        });

        res.json(mappedData);
    } catch (err) {
        console.error('Analytics dataset error:', err);
        res.status(500).json({ error: err.message });
    }
});


// Get admin statistics
router.get('/stats', async (req, res) => {
    try {
        const batchFilter = String(req.query.batch || '2027').trim();

        const driveCount = await PlacementDrive.countDocuments();
        const alumniCount = await AlumniInsight.countDocuments();
        const applicationCount = await Application.countDocuments();

        const students = parseStudentCsv();
        console.log(`[Stats DEBUG] Total students parsed: ${students.length}`);
        console.log(`[Stats DEBUG] Searching for batch: "${batchFilter}" (Type: ${typeof batchFilter})`);

        const filteredStudents = students.filter(s => {
            const matches = s.batch === batchFilter;
            if (students.indexOf(s) < 5) {
                console.log(`[Stats DEBUG] Student batch: "${s.batch}" (Type: ${typeof s.batch}) - Matches: ${matches}`);
            }
            return matches;
        });
        const studentCount = filteredStudents.length;
        console.log(`[Stats DEBUG] Filtered count: ${studentCount}`);
        const placedStudents = filteredStudents.filter(s => s.placementStatus === 'placed').length;
        const inProcessStudents = filteredStudents.filter(s => s.placementStatus === 'in_process').length;

        // Department-wise statistics
        const deptMap = {};
        filteredStudents.forEach(s => {
            const dept = s.department || 'Unknown';
            if (!deptMap[dept]) {
                deptMap[dept] = { count: 0, placed: 0, totalCgpa: 0 };
            }
            deptMap[dept].count++;
            if (s.placementStatus === 'placed') deptMap[dept].placed++;
            deptMap[dept].totalCgpa += s.cgpa;
        });

        const departmentStats = Object.keys(deptMap).map(dept => ({
            _id: dept,
            count: deptMap[dept].count,
            placed: deptMap[dept].placed,
            avgCgpa: deptMap[dept].totalCgpa / (deptMap[dept].count || 1),
            placementPercentage: (deptMap[dept].placed / (deptMap[dept].count || 1)) * 100
        })).sort((a, b) => b.placementPercentage - a.placementPercentage);

        // Placement status distribution
        const placementStatusCounts = {};
        filteredStudents.forEach(s => {
            placementStatusCounts[s.placementStatus] = (placementStatusCounts[s.placementStatus] || 0) + 1;
        });
        const placementStats = Object.keys(placementStatusCounts).map(status => ({
            _id: status,
            count: placementStatusCounts[status]
        }));

        // CTC statistics (Improved mock if DB is empty)
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

        // Combined result
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
            ctcStats: ctcStatsDb[0] || {
                avgCTC: 1450000,
                maxCTC: 4800000,
                minCTC: 450000
            },
            debug: {
                totalStudents: students.length,
                batchFilter,
                sampleBatch: students[0]?.batch,
                filteredCount: filteredStudents.length
            }
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

router.put('/drive/:id', async (req, res) => {
    try {
        const drive = await PlacementDrive.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Notify students about the update
        const notification = new Notification({
            targetRole: 'student',
            title: 'Placement Drive Updated',
            message: `Updates for ${drive.companyName} placement drive. Check details.`,
            type: 'drive',
            priority: 'medium',
            relatedDrive: drive._id
        });
        await notification.save();

        res.json(drive);
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
                userId: application.studentId.userId, // Fixed: Use User ID, not Profile ID
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
        console.log(`[Admin] Fetching applications for drive: ${req.params.driveId}`);
        const applications = await Application.find({ driveId: req.params.driveId })
            .populate('studentId')
            .sort({ appliedDate: -1 });

        console.log(`[Admin] Found ${applications.length} applications from endpoint 1`);
        res.json(applications);
    } catch (err) {
        console.error(`[Admin] Error fetching applications:`, err);
        res.status(500).json({ error: err.message });
    }
});

// Alias for applicants (same as applications)
router.get('/drive/:driveId/applicants', async (req, res) => {
    try {
        console.log(`[Admin] Fetching applicants for drive: ${req.params.driveId}`);
        const applications = await Application.find({ driveId: req.params.driveId })
            .populate('studentId')
            .sort({ appliedDate: -1 });

        console.log(`[Admin] Found ${applications.length} applications`);
        if (applications.length > 0) {
            console.log(`[Admin] Sample application student:`, applications[0].studentId);
        }
        res.json(applications);
    } catch (err) {
        console.error(`[Admin] Error fetching applicants:`, err);
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

// Get all companies with stats
router.get('/companies', async (req, res) => {
    try {
        // Aggregate drives by company
        const driveStats = await PlacementDrive.aggregate([
            {
                $group: {
                    _id: "$companyName",
                    drivesCount: { $sum: 1 },
                    lastDriveDate: { $max: "$date" }
                }
            }
        ]);

        // Aggregate hires by company
        const hireStats = await StudentProfile.aggregate([
            { $match: { placementStatus: 'placed' } },
            {
                $group: {
                    _id: "$offeredCompany",
                    hiredCount: { $sum: 1 }
                }
            }
        ]);

        // Merge results
        const companies = driveStats.map(ds => {
            const hireData = hireStats.find(hs => hs._id === ds._id);
            return {
                id: ds._id, // using name as id for list key
                name: ds._id,
                drives: ds.drivesCount,
                hired: hireData ? hireData.hiredCount : 0,
                status: new Date(ds.lastDriveDate) > new Date() ? 'active' : 'inactive',
                lastActive: ds.lastDriveDate
            };
        });

        res.json(companies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
