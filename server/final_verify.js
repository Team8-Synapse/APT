const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const uri = process.env.MONGODB_URI;

async function verify() {
    try {
        await mongoose.connect(uri);
        const user = await User.findOne({ email: 'cir@amrita.edu' });
        const match = await bcrypt.compare('password123', user.password);
        console.log(`VERIFICATION_RESULT: ${match ? 'SUCCESS' : 'FAILURE'}`);
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

verify();
