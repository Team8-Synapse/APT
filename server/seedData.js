const mongoose = require('mongoose');
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const PlacementDrive = require('./models/PlacementDrive');
const AlumniInsight = require('./models/AlumniInsight');
const Resource = require('./models/Resource');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/placement_tracker';

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await StudentProfile.deleteMany({});
        await PlacementDrive.deleteMany({});
        await AlumniInsight.deleteMany({});
        await Resource.deleteMany({});

        console.log('Cleared existing data.');

        // 1. Create Admin
        const adminUser = new User({ email: 'cir@amrita.edu', password: 'password123', role: 'admin' });
        await adminUser.save();

        // 2. Create Students
        const studentEmails = ['arjun@amrita.edu', 'sneha@amrita.edu', 'vijay@amrita.edu', 'ananya@amrita.edu'];

        for (const email of studentEmails) {
            const user = new User({ email, password: 'password123', role: 'student' });
            await user.save();

            const profile = new StudentProfile({
                userId: user._id,
                firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
                lastName: 'Kumar',
                department: email === 'sneha@amrita.edu' ? 'ECE' : 'CSE',
                cgpa: 8.5 + (Math.random() * 1.4),
                batch: '2026',
                backlogs: 0,
                skills: [
                    { name: 'Java', level: 'Advanced' },
                    { name: 'React', level: 'Intermediate' },
                    { name: 'DSA', level: 'Advanced' }
                ],
                certifications: ['AWS Certified Cloud Practitioner', 'Google Data Analytics']
            });
            await profile.save();
        }

        // 3. Create Placement Drives
        const drivesToInsert = [
            {
                companyName: 'Google',
                jobProfile: 'Software Engineering Intern',
                date: new Date('2026-03-15'),
                description: 'Step into the world of tech with Google. Looking for strong problem solvers.',
                requirements: ['Java', 'C++', 'Python', 'DSA'],
                eligibility: { minCgpa: 8.5, allowedBatches: ['2026'], maxBacklogs: 0 },
                status: 'upcoming'
            },
            {
                companyName: 'Microsoft',
                jobProfile: 'Solution Architect',
                date: new Date('2026-03-22'),
                description: 'Join the Azure team and build scalable enterprise solutions.',
                requirements: ['C#', 'Cloud Computing', 'SQL'],
                eligibility: { minCgpa: 8.0, allowedBatches: ['2026'], maxBacklogs: 0 },
                status: 'upcoming'
            },
            {
                companyName: 'Amazon',
                jobProfile: 'SDE-1',
                date: new Date('2026-04-05'),
                description: 'Work on cutting-edge e-commerce and logistics systems.',
                requirements: ['Java', 'Distributed Systems', 'Go'],
                eligibility: { minCgpa: 7.5, allowedBatches: ['2026'], maxBacklogs: 1 },
                status: 'upcoming'
            }
        ];
        await PlacementDrive.insertMany(drivesToInsert);

        // 4. Create Alumni Insights
        const insightsToInsert = [
            {
                company: 'Google',
                year: 2024,
                alumniName: 'Rahul Sharma',
                experience: 'Focus heavily on LeetCode hard problems and OS fundamentals.',
                rounds: [{
                    name: 'Technical Round 1',
                    difficulty: 'Hard',
                    topics: ['Dynamic Programming', 'Graphs']
                }],
                consentForContact: true
            },
            {
                company: 'Microsoft',
                year: 2023,
                alumniName: 'Priya Nair',
                experience: 'Azure-related questions and system design were the highlights.',
                rounds: [{
                    name: 'Technical Round 1',
                    difficulty: 'Medium',
                    topics: ['System Design', 'Azure']
                }],
                consentForContact: true
            }
        ];
        await AlumniInsight.insertMany(insightsToInsert);

        // 5. Create Resources
        const resourcesToInsert = [
            {
                title: 'Striver SDE Sheet',
                category: 'Coding',
                content: 'The ultimate guide for DSA preparation for top-tier companies.',
                links: ['https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/'],
                addedBy: adminUser._id
            },
            {
                title: 'Indiabix Aptitude',
                category: 'Aptitude',
                content: 'Comprehensive practice for quantitative and logical reasoning.',
                links: ['https://www.indiabix.com/'],
                addedBy: adminUser._id
            },
            {
                title: 'Operating Systems - Galvin',
                category: 'Technical',
                content: 'Complete concepts of OS for technical interviews.',
                links: ['https://codex.cs.yale.edu/avi/os-book/'],
                addedBy: adminUser._id
            }
        ];
        await Resource.insertMany(resourcesToInsert);

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedData();
