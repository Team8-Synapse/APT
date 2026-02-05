const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const uri = process.env.MONGODB_URI;

async function check() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email: 'cir@amrita.edu' });
        if (!user) {
            console.log('Admin user not found');
            return;
        }

        console.log('User found:', user.email);
        console.log('Stored Hash:', user.password);

        const testPasswords = ['password123', 'admin123', 'password', 'cir@123'];
        for (const pw of testPasswords) {
            const match = await bcrypt.compare(pw, user.password);
            console.log(`Testing password "${pw}": ${match ? 'MATCH ✅' : 'NO MATCH ❌'}`);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

check();
