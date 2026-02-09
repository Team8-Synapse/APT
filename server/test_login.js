const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const uri = process.env.MONGODB_URI;

async function test() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('Connected!');

        const email = 'cir@amrita.edu';
        const password = 'password123';

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return;
        }

        console.log('User hash in DB:', user.password);
        const match = await user.comparePassword(password);
        console.log('Password "password123" match:', match);

        const salt = await bcrypt.getSalt(user.password);
        console.log('Salt used:', salt);

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

test();
