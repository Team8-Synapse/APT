const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const uri = process.env.MONGODB_URI;

async function dumpUsers() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('Connected!');

        const users = await User.find({});
        console.log(JSON.stringify(users, null, 2));

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

dumpUsers();
