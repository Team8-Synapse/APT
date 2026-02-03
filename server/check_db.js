const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Import model directly to ensure schema is registered
const StudentProfile = require('./models/StudentProfile');

dotenv.config();

const uri = process.env.MONGODB_URI;
console.log(`Connecting to MongoDB...`);

mongoose.connect(uri)
    .then(async () => {
        console.log('Connected! Querying profiles...');

        try {
            const count = await StudentProfile.countDocuments();
            console.log(`\n=== DATABASE STATUS REPORT ===`);
            console.log(`Total Student Profiles stored: ${count}`);

            if (count > 0) {
                const profiles = await StudentProfile.find().sort({ updatedAt: -1 }).limit(5);
                console.log(`\n=== MOST RECENTLY SAVED PROFILES ===`);
                profiles.forEach((p, i) => {
                    console.log(`\n[Profile #${i + 1}]`);
                    console.log(`Name:        ${p.firstName} ${p.lastName}`);
                    console.log(`Email:       ${p.email}`);
                    console.log(`Roll Number: ${p.rollNumber}`);
                    console.log(`Department:  ${p.department}`);
                    console.log(`CGPA:        ${p.cgpa}`);
                    console.log(`User ID:     ${p.userId}`);
                    console.log(`Last Saved:  ${p.updatedAt}`);
                    console.log(`Skills:      ${p.skills ? p.skills.length : 0} items`);
                });
            } else {
                console.log('\nNO PROFILES FOUND IN DATABASE. The "Save" is definitely failing.');
            }
        } catch (e) {
            console.error('Query Error:', e);
        } finally {
            console.log('\nDone.');
            mongoose.disconnect();
        }
    })
    .catch(err => {
        console.error('Connection Error:', err);
        process.exit(1);
    });
