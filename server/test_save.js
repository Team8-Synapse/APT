const mongoose = require('mongoose');
const dotenv = require('dotenv');
const StudentProfile = require('./models/StudentProfile');

dotenv.config();

console.log('--- DIAGNOSTIC SAVE TEST ---');

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');
        console.log('Database Name:', mongoose.connection.name);

        // Dummy Data
        const dummyId = new mongoose.Types.ObjectId();
        const dummyUser = new mongoose.Types.ObjectId();

        console.log('Attempting to save test profile...');

        const testProfile = {
            userId: dummyUser,
            firstName: "Test",
            lastName: "User",
            rollNumber: "TEST-001-" + Date.now(),
            email: "test@example.com",
            department: "CSE",
            cgpa: 9.0,
            batch: "2026",
            skills: [{ name: "Debugging", level: "Advanced" }]
        };

        const doc = await StudentProfile.findOneAndUpdate(
            { userId: dummyUser },
            testProfile,
            { new: true, upsert: true, runValidators: true }
        );

        console.log('SUCCESS! Saved Profile:', doc._id);

        // Clean up
        await StudentProfile.deleteOne({ _id: doc._id });
        console.log('Cleaned up test profile.');

    } catch (err) {
        console.error('SAVE FAILED:', err);
        if (err.errors) {
            Object.keys(err.errors).forEach(key => {
                console.error(`- Error in ${key}: ${err.errors[key].message}`);
            });
        }
    } finally {
        mongoose.disconnect();
    }
}

run();
