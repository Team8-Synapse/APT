const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const uri = process.env.MONGODB_URI;

async function testStudent() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('Connected!');

        const email = 'cb.sc.u4cse23621@cb.students.amrita.edu';
        const password = 'Harini05';

        const user = await User.findOne({ email });
        if (!user) {
            console.log('Student not found');
            return;
        }

        console.log('User found:', user.email);
        const match = await user.comparePassword(password);
        console.log('Password "Harini05" match:', match);

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

testStudent();
