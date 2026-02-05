const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const uri = process.env.MONGODB_URI;

async function reset() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const email = 'cir@amrita.edu';
        const newPassword = 'password123';

        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Admin user not found. Creating a new one...');
            const newUser = new User({
                email,
                password: newPassword,
                role: 'admin'
            });
            await newUser.save();
            console.log('New admin user created.');
        } else {
            console.log('Admin user found. Resetting password...');
            user.password = newPassword;
            user.isLocked = false;
            user.failedAttempts = 0;
            // The pre-save hook will handle hashing
            await user.save();
            console.log('Admin password reset successfully.');
        }

    } catch (e) {
        console.error('Reset Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

reset();
