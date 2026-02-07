const mongoose = require('mongoose');
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const PlacementDrive = require('./models/PlacementDrive');
const Application = require('./models/Application');

const seedData = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/apt_db');
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await StudentProfile.deleteMany({});
        await PlacementDrive.deleteMany({});
        await Application.deleteMany({});
        console.log('Cleared existing data');

        // Create Admin
        const adminUser = new User({
            email: 'admin@gmail.com',
            password: 'password123',
            role: 'admin'
        });
        await adminUser.save();
        console.log('Admin created: admin@gmail.com / password123');

        // Create Student User
        const studentUser = new User({
            email: 'student@gmail.com',
            password: 'password123',
            role: 'student'
        });
        await studentUser.save();

        // Create Student Profile
        const studentProfile = new StudentProfile({
            userId: studentUser._id,
            rollNumber: 'CB.SC.U4CSE23621',
            firstName: 'Harini',
            lastName: 'S',
            email: 'student@gmail.com',
            department: 'CSE',
            cgpa: 9.5,
            batch: '2026',
            skills: [{ name: 'React', level: 'Advanced' }, { name: 'Node.js', level: 'Intermediate' }],
            placementStatus: 'in_process'
        });
        await studentProfile.save();
        console.log('Student created: student@gmail.com / password123');

        // Create Placement Drive
        const googleDrive = new PlacementDrive({
            companyName: 'Google',
            jobProfile: 'Software Engineer (University Grad)',
            jobDescription: 'Join our team to build next-gen products.',
            criteria: 'B.Tech CSE/ECE, Min 8.5 CGPA',
            ctcDetails: { ctc: 5000000, baseSalary: 3000000 },
            date: new Date('2026-06-02'),
            lastDateToApply: new Date('2026-05-30'),
            workLocation: 'Bangalore',
            eligibility: {
                minCgpa: 8.5,
                maxBacklogs: 0,
                allowedDepartments: ['CSE', 'ECE']
            },
            status: 'upcoming'
        });
        await googleDrive.save();
        console.log('Drive created: Google');

        // Create Application
        const application = new Application({
            studentId: studentProfile._id,
            driveId: googleDrive._id,
            status: 'applied',
            appliedDate: new Date()
        });
        await application.save();

        // Update Drive with applicant
        googleDrive.registeredStudents.push(studentProfile._id);
        await googleDrive.save();

        console.log('Application created for Harini -> Google');

        mongoose.connection.close();
    } catch (err) {
        console.error('Seeding failed:', err);
    }
};

seedData();
