const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const uri = process.env.MONGODB_URI;
console.log(`Connecting to MongoDB...`);

mongoose.connect(uri)
    .then(async () => {
        console.log('Connected! Checking users with email cir@amrita.edu...');

        try {
            const users = await User.find({ email: 'cir@amrita.edu' });
            console.log(`\n=== USER REPORT ===`);
            console.log(`Found ${users.length} users with email cir@amrita.edu`);

            users.forEach((u, i) => {
                console.log(`\n[User #${i + 1}]`);
                console.log(`ID:              ${u._id}`);
                console.log(`Role:            ${u.role}`);
                console.log(`Failed Attempts: ${u.failedAttempts}`);
                console.log(`Is Locked:       ${u.isLocked}`);
                console.log(`Password Hash:   ${u.password}`);
            });

            if (users.length === 0) {
                console.log('\nNO ADMIN ACCOUNT FOUND with email cir@amrita.edu');
            }
        } catch (e) {
            console.error('Check Error:', e);
        } finally {
            console.log('\nDone.');
            mongoose.disconnect();
        }
    })
    .catch(err => {
        console.error('Connection Error:', err);
        process.exit(1);
    });
