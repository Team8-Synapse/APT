const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PlacementDrive = require('./models/PlacementDrive');

dotenv.config();

const seedDrive = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const drive = new PlacementDrive({
            companyName: 'Test Company ' + Math.floor(Math.random() * 1000),
            jobProfile: 'Software Engineer',
            date: new Date(),
            status: 'upcoming',
            jobType: 'Full Time',
            ctcDetails: { ctc: 1200000, baseSalary: 1000000 },
            requirements: ['Node.js', 'React'],
            eligibility: {
                minCgpa: 6.0,
                allowedDepartments: ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'AI', 'CB'],
                maxBacklogs: 2
            }
        });

        await drive.save();
        console.log('Seeded drive:', drive);

        const count = await PlacementDrive.countDocuments({ status: 'upcoming' });
        console.log('Total upcoming drives:', count);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDrive();
