const mongoose = require('mongoose');
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const PlacementDrive = require('./models/PlacementDrive');
const AlumniInsight = require('./models/AlumniInsight');
const Resource = require('./models/Resource');
const Application = require('./models/Application');
const Notification = require('./models/Notification');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/placement_tracker';

// Helper arrays
const departments = ['CSE', 'ECE', 'EEE', 'ME', 'CE'];
const sections = ['A', 'B', 'C'];
const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
    'Rohan', 'Kartik', 'Dhruv', 'Kabir', 'Ritvik', 'Pranav', 'Arnav', 'Shaurya', 'Atharv', 'Advait',
    'Ananya', 'Diya', 'Saanvi', 'Aanya', 'Aadhya', 'Isha', 'Avni', 'Mira', 'Priya', 'Shreya',
    'Kavya', 'Riya', 'Anika', 'Tara', 'Neha', 'Pooja', 'Divya', 'Sneha', 'Kriti', 'Tanvi',
    'Rahul', 'Vikram', 'Amit', 'Suresh', 'Rajesh', 'Karthik', 'Mohan', 'Girish', 'Harsha', 'Tejas',
    'Varun', 'Nikhil', 'Sanjay', 'Deepak', 'Ganesh', 'Naveen', 'Akash', 'Ajay', 'Vijay', 'Manoj',
    'Lakshmi', 'Padma', 'Gayatri', 'Meera', 'Radha'];
const lastNames = ['Kumar', 'Sharma', 'Patel', 'Reddy', 'Nair', 'Menon', 'Iyer', 'Pillai', 'Rao', 'Naidu',
    'Krishnan', 'Subramaniam', 'Venkatesh', 'Ramesh', 'Srinivasan', 'Gupta', 'Singh', 'Joshi', 'Verma', 'Agarwal',
    'Banerjee', 'Mukherjee', 'Das', 'Chatterjee', 'Bose', 'Sen', 'Roy', 'Ghosh', 'Dutta', 'Chakraborty'];

const skillsList = [
    { name: 'Python', level: 'Advanced' },
    { name: 'Java', level: 'Advanced' },
    { name: 'JavaScript', level: 'Intermediate' },
    { name: 'React', level: 'Advanced' },
    { name: 'Node.js', level: 'Intermediate' },
    { name: 'C++', level: 'Advanced' },
    { name: 'SQL', level: 'Intermediate' },
    { name: 'MongoDB', level: 'Beginner' },
    { name: 'AWS', level: 'Beginner' },
    { name: 'Docker', level: 'Intermediate' },
    { name: 'Machine Learning', level: 'Intermediate' },
    { name: 'Data Structures', level: 'Advanced' },
    { name: 'System Design', level: 'Intermediate' },
    { name: 'Git', level: 'Advanced' },
    { name: 'TypeScript', level: 'Intermediate' }
];

const certifications = [
    'AWS Cloud Practitioner', 'Google Data Analytics', 'Microsoft Azure Fundamentals',
    'TensorFlow Developer', 'Oracle Java SE', 'Cisco CCNA', 'CompTIA Security+',
    'MongoDB Developer', 'Kubernetes Administrator', 'Google Cloud Engineer'
];

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
        await Application.deleteMany({});
        await Notification.deleteMany({});

        console.log('Cleared existing data.');

        // 1. Create Admin
        const adminUser = new User({ email: 'cir@amrita.edu', password: 'password123', role: 'admin' });
        await adminUser.save();
        console.log('Admin created: cir@amrita.edu');

        // 2. Create 65 Students (CB.SC.U4CSE22801 - CB.SC.U4CSE22865)
        const students = [];
        for (let i = 1; i <= 65; i++) {
            const rollNumber = `CB.SC.U4CSE228${i.toString().padStart(2, '0')}`;
            const firstName = firstNames[(i - 1) % firstNames.length];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const email = `${firstName.toLowerCase()}${i}@cb.students.amrita.edu`;
            const department = i <= 40 ? 'CSE' : (i <= 55 ? 'ECE' : 'EEE');
            const cgpa = Math.round((7.0 + Math.random() * 2.8) * 100) / 100;
            const section = sections[Math.floor(Math.random() * sections.length)];

            // Random placement status
            const statuses = ['not_placed', 'not_placed', 'not_placed', 'in_process', 'in_process', 'placed'];
            const placementStatus = statuses[Math.floor(Math.random() * statuses.length)];

            // Random skills (3-6 skills per student)
            const numSkills = 3 + Math.floor(Math.random() * 4);
            const shuffledSkills = [...skillsList].sort(() => Math.random() - 0.5);
            const studentSkills = shuffledSkills.slice(0, numSkills);

            // Random certifications (0-3 per student)
            const numCerts = Math.floor(Math.random() * 4);
            const shuffledCerts = [...certifications].sort(() => Math.random() - 0.5);
            const studentCerts = shuffledCerts.slice(0, numCerts);

            const user = new User({ email, password: 'password123', role: 'student' });
            await user.save();

            const profileData = {
                userId: user._id,
                rollNumber,
                firstName,
                lastName,
                email,
                phone: `+91 ${9800000000 + i}`,
                department,
                course: 'B.Tech',
                section,
                cgpa,
                batch: '2026',
                backlogs: Math.random() > 0.85 ? Math.floor(Math.random() * 2) + 1 : 0,
                skills: studentSkills,
                certifications: studentCerts,
                isEligible: cgpa >= 7.0,
                linkedIn: `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}${i}`,
                github: `https://github.com/${firstName.toLowerCase()}${i}`,
                placementStatus,
                tenthPercentage: Math.round((85 + Math.random() * 14) * 10) / 10,
                twelfthPercentage: Math.round((80 + Math.random() * 19) * 10) / 10,
                gap: Math.random() > 0.95 ? 1 : 0,
                internships: cgpa > 8.0 ? [{
                    company: ['Google', 'Microsoft', 'Amazon', 'Startup XYZ', 'TCS', 'Infosys'][Math.floor(Math.random() * 6)],
                    role: ['SDE Intern', 'Data Analyst Intern', 'ML Intern', 'Web Developer Intern'][Math.floor(Math.random() * 4)],
                    duration: ['2 months', '3 months', '6 months'][Math.floor(Math.random() * 3)],
                    description: 'Worked on cutting-edge technology projects'
                }] : [],
                projects: [{
                    title: ['E-commerce Platform', 'ML Model for Prediction', 'Chat Application', 'Portfolio Website', 'IoT Home Automation'][Math.floor(Math.random() * 5)],
                    description: 'A comprehensive project showcasing technical skills',
                    technologies: studentSkills.slice(0, 3).map(s => s.name),
                    link: `https://github.com/${firstName.toLowerCase()}${i}/project`
                }],
                achievements: Math.random() > 0.7 ? ['Hackathon Winner', 'Dean\'s List', 'Research Paper Published'][Math.floor(Math.random() * 3)] : [],
                preferredRoles: ['Software Engineer', 'Full Stack Developer', 'Data Scientist', 'ML Engineer'].slice(0, 2),
                preferredLocations: ['Bangalore', 'Hyderabad', 'Chennai', 'Pune'].slice(0, 2),
                expectedCTC: 800000 + Math.floor(Math.random() * 1200000)
            };

            if (placementStatus === 'placed') {
                profileData.offeredCompany = ['Google', 'Microsoft', 'Amazon', 'Adobe', 'Cisco'][Math.floor(Math.random() * 5)];
                profileData.offeredRole = 'Software Engineer';
                profileData.offeredCTC = 1200000 + Math.floor(Math.random() * 3000000);
                profileData.offerDate = new Date('2026-01-15');
            }

            const profile = new StudentProfile(profileData);
            await profile.save();
            students.push(profile);
        }
        console.log(`Created 65 students (CB.SC.U4CSE22801 - CB.SC.U4CSE22865)`);

        // 3. Create 15 Placement Drives
        const drivesToInsert = [
            {
                companyName: 'Google',
                companyLogo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
                companyWebsite: 'https://careers.google.com',
                companyDescription: 'Google LLC is an American multinational technology company focusing on AI, online advertising, and cloud computing.',
                industry: 'Technology',
                jobProfile: 'Software Engineer L3',
                jobDescription: 'Design and develop scalable systems for Google products used by billions.',
                jobType: 'Full Time',
                date: new Date('2026-03-15'),
                registrationDeadline: new Date('2026-03-10'),
                venue: 'Main Auditorium',
                mode: 'Hybrid',
                requirements: ['Java/C++/Python', 'Data Structures', 'Algorithms', 'System Design'],
                eligibility: { minCgpa: 8.5, allowedBatches: ['2026'], allowedDepartments: ['CSE', 'ECE'], maxBacklogs: 0, minTenthPercentage: 80, minTwelfthPercentage: 75 },
                ctcDetails: { ctc: 4500000, baseSalary: 2800000, bonus: 700000, stocks: 1000000 },
                benefits: ['Health Insurance', 'RSUs', 'Relocation Bonus', 'Learning Budget'],
                selectionProcess: [
                    { roundNumber: 1, roundName: 'Online Assessment', description: 'Coding + MCQs', duration: '90 mins' },
                    { roundNumber: 2, roundName: 'Technical Interview 1', description: 'DSA + Problem Solving', duration: '60 mins' },
                    { roundNumber: 3, roundName: 'Technical Interview 2', description: 'System Design', duration: '45 mins' },
                    { roundNumber: 4, roundName: 'HR Round', description: 'Behavioral Interview', duration: '30 mins' }
                ],
                status: 'upcoming',
                totalPositions: 5,
                workLocation: 'Bangalore/Hyderabad',
                coordinator: 'Dr. Ramesh Kumar'
            },
            {
                companyName: 'Microsoft',
                companyLogo: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b',
                companyWebsite: 'https://careers.microsoft.com',
                companyDescription: 'Microsoft Corporation develops, licenses, and sells computer software, consumer electronics, and personal computers.',
                industry: 'Technology',
                jobProfile: 'Software Development Engineer',
                jobDescription: 'Build products that millions of people use every day in Azure, Office, and Windows.',
                jobType: 'Full Time',
                date: new Date('2026-03-22'),
                registrationDeadline: new Date('2026-03-18'),
                venue: 'Seminar Hall A',
                mode: 'Offline',
                requirements: ['C#/.NET/Java', 'Cloud Computing', 'SQL', 'Problem Solving'],
                eligibility: { minCgpa: 8.0, allowedBatches: ['2026'], allowedDepartments: ['CSE', 'ECE', 'EEE'], maxBacklogs: 0 },
                ctcDetails: { ctc: 4200000, baseSalary: 2600000, bonus: 600000, stocks: 1000000 },
                benefits: ['Health Insurance', 'Stock Options', 'Wellness Programs', 'Free Certifications'],
                selectionProcess: [
                    { roundNumber: 1, roundName: 'Online Coding Test', description: '3 coding problems', duration: '75 mins' },
                    { roundNumber: 2, roundName: 'Group Fly', description: 'Coding on paper', duration: '2 hours' },
                    { roundNumber: 3, roundName: 'Technical Interview', description: 'Problem solving', duration: '60 mins' },
                    { roundNumber: 4, roundName: 'AA Round', description: 'As Appropriate Interview', duration: '45 mins' }
                ],
                status: 'upcoming',
                totalPositions: 8,
                workLocation: 'Hyderabad',
                coordinator: 'Prof. Anitha Menon'
            },
            {
                companyName: 'Amazon',
                companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
                companyWebsite: 'https://amazon.jobs',
                companyDescription: 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, and AI.',
                industry: 'E-commerce/Cloud',
                jobProfile: 'SDE-1',
                jobDescription: 'Build highly scalable systems for Amazon retail and AWS.',
                jobType: 'Full Time',
                date: new Date('2026-04-05'),
                registrationDeadline: new Date('2026-04-01'),
                venue: 'CS Block Seminar Hall',
                mode: 'Offline',
                requirements: ['Java/Python', 'Distributed Systems', 'Go', 'AWS'],
                eligibility: { minCgpa: 7.5, allowedBatches: ['2026'], allowedDepartments: ['CSE', 'ECE'], maxBacklogs: 1 },
                ctcDetails: { ctc: 4000000, baseSalary: 2400000, bonus: 600000, stocks: 1000000 },
                benefits: ['Signing Bonus', 'RSUs', 'Relocation', 'Prime Membership'],
                selectionProcess: [
                    { roundNumber: 1, roundName: 'Online Assessment', description: '2 coding + Work Simulation', duration: '90 mins' },
                    { roundNumber: 2, roundName: 'Phone Screen', description: 'LP focused', duration: '45 mins' },
                    { roundNumber: 3, roundName: 'Loop Interviews', description: '4 rounds of interviews', duration: '4 hours' }
                ],
                status: 'upcoming',
                totalPositions: 12,
                workLocation: 'Bangalore/Chennai',
                coordinator: 'Dr. Vijay Nair'
            },
            {
                companyName: 'Adobe',
                companyWebsite: 'https://adobe.wd5.myworkdayjobs.com',
                companyDescription: 'Adobe Inc. is a multinational software company focused on creativity and digital marketing solutions.',
                industry: 'Software',
                jobProfile: 'Member of Technical Staff',
                jobDescription: 'Work on Creative Cloud, Document Cloud, and Experience Cloud products.',
                jobType: 'Full Time',
                date: new Date('2026-03-28'),
                registrationDeadline: new Date('2026-03-24'),
                venue: 'Virtual',
                mode: 'Online',
                requirements: ['C++/Java', 'OOPS', 'DSA', 'Problem Solving'],
                eligibility: { minCgpa: 7.5, allowedBatches: ['2026'], allowedDepartments: ['CSE', 'ECE'], maxBacklogs: 0 },
                ctcDetails: { ctc: 2100000, baseSalary: 1800000, bonus: 300000 },
                benefits: ['Health Insurance', 'Free Creative Cloud', 'Gym Membership'],
                selectionProcess: [
                    { roundNumber: 1, roundName: 'HackerRank Test', description: 'MCQ + Coding', duration: '90 mins' },
                    { roundNumber: 2, roundName: 'Technical Round 1', description: 'DSA focus', duration: '60 mins' },
                    { roundNumber: 3, roundName: 'Technical Round 2', description: 'System Design', duration: '60 mins' },
                    { roundNumber: 4, roundName: 'HR Round', description: 'Cultural Fit', duration: '30 mins' }
                ],
                status: 'upcoming',
                totalPositions: 6,
                workLocation: 'Noida/Bangalore',
                coordinator: 'Prof. Kavitha Iyer'
            },
            {
                companyName: 'Cisco',
                companyWebsite: 'https://jobs.cisco.com',
                companyDescription: 'Cisco Systems develops networking hardware, software, and telecommunications equipment.',
                industry: 'Networking',
                jobProfile: 'Software Engineer',
                jobDescription: 'Develop next-generation networking solutions and security products.',
                jobType: 'Full Time',
                date: new Date('2026-04-12'),
                registrationDeadline: new Date('2026-04-08'),
                venue: 'Main Building Auditorium',
                mode: 'Offline',
                requirements: ['C/C++', 'Networking', 'Linux', 'Python'],
                eligibility: { minCgpa: 7.5, allowedBatches: ['2026'], allowedDepartments: ['CSE', 'ECE', 'EEE'], maxBacklogs: 0 },
                ctcDetails: { ctc: 1800000, baseSalary: 1500000, bonus: 300000 },
                benefits: ['Health Insurance', 'Stock Options', 'Work from Home'],
                selectionProcess: [
                    { roundNumber: 1, roundName: 'Online Test', description: 'Aptitude + Technical', duration: '60 mins' },
                    { roundNumber: 2, roundName: 'Technical Interview', description: 'Networking + Coding', duration: '60 mins' },
                    { roundNumber: 3, roundName: 'HR Round', description: 'HR Discussion', duration: '30 mins' }
                ],
                status: 'upcoming',
                totalPositions: 10,
                workLocation: 'Bangalore',
                coordinator: 'Dr. Suresh Pillai'
            },
            {
                companyName: 'Oracle',
                companyWebsite: 'https://oracle.com/careers',
                industry: 'Enterprise Software',
                jobProfile: 'Application Developer',
                jobDescription: 'Build enterprise-grade cloud applications.',
                jobType: 'Full Time',
                date: new Date('2026-04-18'),
                registrationDeadline: new Date('2026-04-14'),
                mode: 'Hybrid',
                requirements: ['Java', 'SQL', 'Cloud', 'OOPS'],
                eligibility: { minCgpa: 7.0, allowedBatches: ['2026'], allowedDepartments: ['CSE', 'ECE', 'EEE', 'ME'], maxBacklogs: 1 },
                ctcDetails: { ctc: 1600000, baseSalary: 1400000, bonus: 200000 },
                selectionProcess: [
                    { roundNumber: 1, roundName: 'Online Assessment', description: 'MCQ + SQL queries', duration: '90 mins' },
                    { roundNumber: 2, roundName: 'Technical Interview', description: 'Java + SQL', duration: '45 mins' },
                    { roundNumber: 3, roundName: 'HR Round', description: 'Discussion', duration: '30 mins' }
                ],
                status: 'upcoming',
                totalPositions: 15,
                workLocation: 'Hyderabad/Bangalore'
            },
            {
                companyName: 'Salesforce',
                companyWebsite: 'https://salesforce.com/careers',
                industry: 'CRM/Cloud',
                jobProfile: 'Associate Member of Technical Staff',
                description: 'Join the #1 CRM company.',
                jobType: 'Full Time',
                date: new Date('2026-04-25'),
                registrationDeadline: new Date('2026-04-20'),
                mode: 'Online',
                requirements: ['Java/Apex', 'Web Technologies', 'Problem Solving'],
                eligibility: { minCgpa: 8.0, allowedBatches: ['2026'], allowedDepartments: ['CSE'], maxBacklogs: 0 },
                ctcDetails: { ctc: 2500000, baseSalary: 2000000, bonus: 500000 },
                status: 'upcoming',
                totalPositions: 4,
                workLocation: 'Hyderabad'
            },
            {
                companyName: 'Infosys',
                industry: 'IT Services',
                jobProfile: 'Systems Engineer',
                jobType: 'Full Time',
                date: new Date('2026-05-02'),
                registrationDeadline: new Date('2026-04-28'),
                mode: 'Offline',
                requirements: ['Any programming language', 'Aptitude', 'Communication'],
                eligibility: { minCgpa: 6.5, allowedBatches: ['2026'], allowedDepartments: ['CSE', 'ECE', 'EEE', 'ME', 'CE'], maxBacklogs: 0 },
                ctcDetails: { ctc: 360000, baseSalary: 340000, bonus: 20000 },
                selectionProcess: [
                    { roundNumber: 1, roundName: 'InfyTQ', description: 'Online test', duration: '180 mins' },
                    { roundNumber: 2, roundName: 'Interview', description: 'Technical + HR', duration: '45 mins' }
                ],
                status: 'upcoming',
                totalPositions: 50,
                workLocation: 'Multiple'
            },
            {
                companyName: 'TCS',
                industry: 'IT Services',
                jobProfile: 'Assistant System Engineer',
                jobType: 'Full Time',
                date: new Date('2026-05-10'),
                registrationDeadline: new Date('2026-05-05'),
                mode: 'Offline',
                requirements: ['Coding', 'Aptitude', 'English'],
                eligibility: { minCgpa: 6.0, allowedBatches: ['2026'], allowedDepartments: ['CSE', 'ECE', 'EEE', 'ME', 'CE'], maxBacklogs: 0 },
                ctcDetails: { ctc: 350000, baseSalary: 330000, bonus: 20000 },
                status: 'upcoming',
                totalPositions: 100,
                workLocation: 'Multiple'
            },
            {
                companyName: 'Wipro',
                industry: 'IT Services',
                jobProfile: 'Project Engineer',
                jobType: 'Full Time',
                date: new Date('2026-05-15'),
                registrationDeadline: new Date('2026-05-10'),
                mode: 'Offline',
                requirements: ['Programming', 'Communication'],
                eligibility: { minCgpa: 6.0, allowedBatches: ['2026'], allowedDepartments: ['CSE', 'ECE', 'EEE', 'ME', 'CE'], maxBacklogs: 0 },
                ctcDetails: { ctc: 380000, baseSalary: 350000, bonus: 30000 },
                status: 'upcoming',
                totalPositions: 80,
                workLocation: 'Multiple'
            },
            {
                companyName: 'Bosch',
                industry: 'Engineering/Automotive',
                jobProfile: 'Software Developer',
                jobType: 'Full Time',
                date: new Date('2026-04-08'),
                registrationDeadline: new Date('2026-04-04'),
                mode: 'Offline',
                requirements: ['C/C++', 'Embedded Systems', 'Automotive'],
                eligibility: { minCgpa: 7.0, allowedBatches: ['2026'], allowedDepartments: ['CSE', 'ECE', 'EEE', 'ME'], maxBacklogs: 0 },
                ctcDetails: { ctc: 1000000, baseSalary: 900000, bonus: 100000 },
                status: 'upcoming',
                totalPositions: 20,
                workLocation: 'Bangalore/Coimbatore'
            },
            {
                companyName: 'L&T Technology Services',
                industry: 'Engineering Services',
                jobProfile: 'Graduate Engineer Trainee',
                jobType: 'Full Time',
                date: new Date('2026-04-22'),
                registrationDeadline: new Date('2026-04-18'),
                mode: 'Offline',
                requirements: ['Core Engineering', 'CAD/CAM', 'Programming'],
                eligibility: { minCgpa: 7.0, allowedBatches: ['2026'], allowedDepartments: ['ME', 'EEE', 'ECE', 'CSE'], maxBacklogs: 0 },
                ctcDetails: { ctc: 650000, baseSalary: 600000, bonus: 50000 },
                status: 'upcoming',
                totalPositions: 25,
                workLocation: 'Chennai/Mumbai'
            },
            {
                companyName: 'Meta',
                industry: 'Technology/Social Media',
                jobProfile: 'Software Engineer (University Grad)',
                jobType: 'Full Time',
                date: new Date('2026-03-18'),
                registrationDeadline: new Date('2026-03-14'),
                mode: 'Hybrid',
                requirements: ['Python/C++', 'DSA', 'System Design', 'ML basics'],
                eligibility: { minCgpa: 8.5, allowedBatches: ['2026'], allowedDepartments: ['CSE'], maxBacklogs: 0 },
                ctcDetails: { ctc: 5000000, baseSalary: 3000000, bonus: 800000, stocks: 1200000 },
                status: 'upcoming',
                totalPositions: 3,
                workLocation: 'London/Menlo Park'
            },
            {
                companyName: 'Goldman Sachs',
                industry: 'Finance/Technology',
                jobProfile: 'New Analyst',
                jobType: 'Full Time',
                date: new Date('2026-03-25'),
                registrationDeadline: new Date('2026-03-20'),
                mode: 'Offline',
                requirements: ['Java/Python', 'Data Structures', 'Problem Solving', 'Finance basics'],
                eligibility: { minCgpa: 8.0, allowedBatches: ['2026'], allowedDepartments: ['CSE', 'ECE'], maxBacklogs: 0 },
                ctcDetails: { ctc: 2800000, baseSalary: 2200000, bonus: 600000 },
                status: 'upcoming',
                totalPositions: 6,
                workLocation: 'Bangalore'
            },
            {
                companyName: 'Samsung R&D',
                industry: 'Electronics/R&D',
                jobProfile: 'Software Engineer',
                jobType: 'Full Time',
                date: new Date('2026-04-02'),
                registrationDeadline: new Date('2026-03-28'),
                mode: 'Offline',
                requirements: ['C/C++', 'Android', 'DSA'],
                eligibility: { minCgpa: 7.5, allowedBatches: ['2026'], allowedDepartments: ['CSE', 'ECE'], maxBacklogs: 0 },
                ctcDetails: { ctc: 1800000, baseSalary: 1500000, bonus: 300000 },
                status: 'upcoming',
                totalPositions: 8,
                workLocation: 'Bangalore/Noida'
            }
        ];
        await PlacementDrive.insertMany(drivesToInsert);
        console.log(`Created ${drivesToInsert.length} placement drives`);

        // 4. Create Alumni Insights
        const insightsToInsert = [
            {
                company: 'Google',
                year: 2025,
                alumniName: 'Rahul Sharma',
                currentRole: 'Software Engineer L4',
                department: 'CSE',
                batch: '2025',
                experience: 'The interview process was intense but fair. Focus heavily on LeetCode hard problems, especially dynamic programming and graphs. System design round was unexpected for fresh grads.',
                overallRating: 5,
                difficultyLevel: 'Very Hard',
                preparationTips: ['Complete Striver SDE Sheet', 'Practice system design basics', 'Mock interviews are crucial', 'Understand time complexity deeply'],
                resourcesUsed: ['LeetCode Premium', 'Grokking System Design', 'Striver A2Z'],
                rounds: [
                    { name: 'Online Assessment', type: 'Coding', difficulty: 'Hard', duration: '90 mins', topics: ['Arrays', 'DP', 'Graphs'], tips: 'Time management is key' },
                    { name: 'Technical Round 1', type: 'Technical', difficulty: 'Hard', duration: '60 mins', topics: ['Dynamic Programming', 'Graphs'], questions: ['LCS variant', 'Dijkstra modification'] },
                    { name: 'Technical Round 2', type: 'Technical', difficulty: 'Medium', duration: '45 mins', topics: ['System Design'], questions: ['Design URL shortener'] },
                    { name: 'HR Round', type: 'HR', difficulty: 'Easy', duration: '30 mins', topics: ['Behavioral'], questions: ['Tell me about a challenging project'] }
                ],
                offerDetails: { role: 'Software Engineer L3', ctc: 4500000, location: 'Bangalore', joiningBonus: 500000 },
                wouldRecommend: true,
                consentForContact: true,
                verified: true
            },
            {
                company: 'Microsoft',
                year: 2024,
                alumniName: 'Priya Nair',
                currentRole: 'Software Engineer II',
                department: 'CSE',
                batch: '2024',
                experience: 'Azure-related questions and system design were the highlights. They really test your problem-solving approach more than getting the perfect solution.',
                overallRating: 4,
                difficultyLevel: 'Hard',
                preparationTips: ['Learn Azure basics', 'Practice explaining your thought process', 'Brush up on OOPS concepts'],
                resourcesUsed: ['InterviewBit', 'GeeksforGeeks', 'Microsoft Learn'],
                rounds: [
                    { name: 'Online Coding', type: 'Coding', difficulty: 'Medium', duration: '75 mins', topics: ['Arrays', 'Trees'], tips: 'Focus on code quality' },
                    { name: 'Group Fly', type: 'Coding', difficulty: 'Medium', duration: '2 hours', topics: ['DSA'], questions: ['2 problems on paper'] },
                    { name: 'Technical Interview', type: 'Technical', difficulty: 'Hard', duration: '60 mins', topics: ['System Design', 'Azure'] }
                ],
                offerDetails: { role: 'SDE', ctc: 4200000, location: 'Hyderabad' },
                consentForContact: true,
                verified: true
            },
            {
                company: 'Amazon',
                year: 2025,
                alumniName: 'Aditya Kumar',
                currentRole: 'SDE-1',
                department: 'CSE',
                batch: '2025',
                experience: 'Leadership Principles are EVERYTHING at Amazon. Every single answer should demonstrate at least one LP. Prepare STAR method stories.',
                overallRating: 4,
                difficultyLevel: 'Hard',
                preparationTips: ['Memorize all 16 LPs with examples', 'Practice STAR method', 'Solve Amazon tagged problems on LeetCode'],
                rounds: [
                    { name: 'Online Assessment', type: 'Coding', difficulty: 'Medium', duration: '90 mins', topics: ['Arrays', 'Strings'], tips: 'Work simulation is tricky' },
                    { name: 'Loop 1', type: 'Technical', difficulty: 'Hard', topics: ['DSA', 'LP'] },
                    { name: 'Loop 2', type: 'Technical', difficulty: 'Hard', topics: ['System Design', 'LP'] },
                    { name: 'Loop 3', type: 'HR', difficulty: 'Medium', topics: ['LP', 'Behavioral'] },
                    { name: 'Bar Raiser', type: 'Technical', difficulty: 'Very Hard', topics: ['Deep dive', 'LP'] }
                ],
                offerDetails: { role: 'SDE-1', ctc: 4000000, location: 'Bangalore' },
                consentForContact: true,
                verified: true
            },
            {
                company: 'Adobe',
                year: 2024,
                alumniName: 'Sneha Reddy',
                currentRole: 'MTS',
                department: 'ECE',
                batch: '2024',
                experience: 'Very chill interview experience compared to FAANG. Focus on OOPS and clean code. They love creative problem solvers.',
                overallRating: 5,
                difficultyLevel: 'Medium',
                preparationTips: ['Strong OOPS fundamentals', 'Practice design patterns', 'Be creative in your solutions'],
                rounds: [
                    { name: 'HackerRank', type: 'Online Test', difficulty: 'Medium', duration: '90 mins', topics: ['MCQ', 'Coding'] },
                    { name: 'Technical 1', type: 'Technical', difficulty: 'Medium', topics: ['DSA', 'OOPS'] },
                    { name: 'Technical 2', type: 'Technical', difficulty: 'Medium', topics: ['Design Patterns', 'Projects'] },
                    { name: 'HR', type: 'HR', difficulty: 'Easy', topics: ['Culture fit'] }
                ],
                offerDetails: { role: 'Member of Technical Staff', ctc: 2100000, location: 'Noida' },
                consentForContact: true,
                verified: true
            },
            {
                company: 'Goldman Sachs',
                year: 2025,
                alumniName: 'Vikram Menon',
                currentRole: 'Analyst',
                department: 'CSE',
                batch: '2025',
                experience: 'Expect puzzles and probability questions along with DSA. They test your analytical thinking extensively.',
                overallRating: 4,
                difficultyLevel: 'Hard',
                preparationTips: ['Practice probability puzzles', 'Learn basic finance concepts', 'Brush up on mathematics'],
                rounds: [
                    { name: 'HireVue', type: 'Online Test', difficulty: 'Hard', duration: '60 mins', topics: ['Aptitude', 'Coding'] },
                    { name: 'Technical', type: 'Technical', difficulty: 'Hard', topics: ['DSA', 'Puzzles', 'Finance'] }
                ],
                offerDetails: { role: 'New Analyst', ctc: 2800000, location: 'Bangalore' },
                consentForContact: false,
                verified: true
            },
            {
                company: 'Cisco',
                year: 2024,
                alumniName: 'Kavya Pillai',
                currentRole: 'Software Engineer',
                department: 'ECE',
                batch: '2024',
                experience: 'Strong focus on networking concepts. If you\'re from ECE, you have an advantage. Practice CCNA level concepts.',
                overallRating: 4,
                difficultyLevel: 'Medium',
                preparationTips: ['Study OSI model thoroughly', 'Practice subnetting', 'Know TCP/IP inside out'],
                rounds: [
                    { name: 'Online Test', type: 'Online Test', difficulty: 'Medium', topics: ['Networking', 'Aptitude'] },
                    { name: 'Technical', type: 'Technical', difficulty: 'Medium', topics: ['Networking', 'C/C++'] }
                ],
                offerDetails: { role: 'Software Engineer', ctc: 1800000, location: 'Bangalore' },
                consentForContact: true,
                verified: true
            },
            {
                company: 'Infosys',
                year: 2024,
                alumniName: 'Rohan Das',
                department: 'CSE',
                batch: '2024',
                experience: 'InfyTQ is key. If you clear it with good score, interview is mostly a formality. Focus on their training platform.',
                overallRating: 3,
                difficultyLevel: 'Easy',
                preparationTips: ['Complete InfyTQ certification', 'Basic programming is enough', 'Communication skills matter'],
                rounds: [
                    { name: 'InfyTQ Test', type: 'Online Test', difficulty: 'Medium', topics: ['Programming', 'Aptitude'] },
                    { name: 'Interview', type: 'HR', difficulty: 'Easy', topics: ['Communication', 'Basic tech'] }
                ],
                offerDetails: { role: 'Systems Engineer', ctc: 360000, location: 'Mysore' },
                consentForContact: true,
                verified: true
            },
            {
                company: 'Samsung R&D',
                year: 2025,
                alumniName: 'Ishaan Rao',
                department: 'CSE',
                batch: '2025',
                experience: 'Their coding test is unique - 3 hour single problem that requires complete solution. Practice complete implementations.',
                overallRating: 4,
                difficultyLevel: 'Hard',
                preparationTips: ['Practice coding for 3 hours straight', 'Focus on implementation, not just logic', 'Know Android basics'],
                rounds: [
                    { name: 'Coding Test', type: 'Coding', difficulty: 'Hard', duration: '3 hours', topics: ['Implementation'] },
                    { name: 'Technical', type: 'Technical', difficulty: 'Medium', topics: ['C++', 'Android', 'OOPS'] }
                ],
                offerDetails: { role: 'Software Engineer', ctc: 1800000, location: 'Bangalore' },
                consentForContact: true,
                verified: true
            }
        ];
        await AlumniInsight.insertMany(insightsToInsert);
        console.log(`Created ${insightsToInsert.length} alumni insights`);

        // 5. Create Resources
        const resourcesToInsert = [
            {
                title: 'Striver SDE Sheet',
                category: 'Coding',
                content: 'The ultimate guide for DSA preparation for top-tier companies. 191 most important problems.',
                links: ['https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/'],
                addedBy: adminUser._id
            },
            {
                title: 'NeetCode 150',
                category: 'Coding',
                content: 'Curated 150 problems covering all important patterns for FAANG interviews.',
                links: ['https://neetcode.io/'],
                addedBy: adminUser._id
            },
            {
                title: 'System Design Primer',
                category: 'System Design',
                content: 'Comprehensive guide to system design interviews with examples.',
                links: ['https://github.com/donnemartin/system-design-primer'],
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
            },
            {
                title: 'DBMS Gate Smashers',
                category: 'Technical',
                content: 'DBMS concepts explained in Hindi/English for interviews.',
                links: ['https://youtube.com/gatesmashers'],
                addedBy: adminUser._id
            },
            {
                title: 'InterviewBit',
                category: 'Coding',
                content: 'Practice platform with guided learning paths for product companies.',
                links: ['https://interviewbit.com/'],
                addedBy: adminUser._id
            },
            {
                title: 'Resume Templates',
                category: 'Career',
                content: 'Professional resume templates used by students placed at FAANG.',
                links: ['https://www.overleaf.com/gallery/tagged/cv'],
                addedBy: adminUser._id
            }
        ];
        await Resource.insertMany(resourcesToInsert);
        console.log(`Created ${resourcesToInsert.length} resources`);

        // 6. Create Welcome Notification
        await Notification.create({
            targetRole: 'all',
            title: '🎉 Welcome to Placement Tracker 2026!',
            message: 'Your personalized placement journey starts here. Complete your profile to unlock AI-powered recommendations.',
            type: 'announcement',
            priority: 'high',
            actionRequired: true,
            actionLabel: 'Complete Profile',
            actionUrl: '/profile'
        });

        // 7. Create drive notifications
        await Notification.create({
            targetRole: 'student',
            title: '🚀 Google is coming!',
            message: 'Google placement drive is scheduled for March 15, 2026. Register before March 10.',
            type: 'drive',
            priority: 'urgent',
            actionRequired: true,
            actionLabel: 'Register Now',
            actionUrl: '/drives'
        });

        console.log('Notifications created');
        console.log('\n✅ Seeding completed successfully!');
        console.log('📊 Summary:');
        console.log('   - 1 Admin (cir@amrita.edu)');
        console.log('   - 65 Students (CB.SC.U4CSE22801 - CB.SC.U4CSE22865)');
        console.log(`   - ${drivesToInsert.length} Placement Drives`);
        console.log(`   - ${insightsToInsert.length} Alumni Insights`);
        console.log(`   - ${resourcesToInsert.length} Resources`);
        console.log('   - Multiple Notifications');

    } catch (err) {
        console.error('Seeding error:', err);
    }
};

// Export for use when required as a module
module.exports = seedData;

// Only run directly if this file is executed standalone
if (require.main === module) {
    seedData().then(() => process.exit(0)).catch(() => process.exit(1));
}
