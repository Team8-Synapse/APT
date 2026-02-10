const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const User = require('./models/User');

dotenv.config();

const uri = process.env.MONGODB_URI;

async function dumpUsers() {
    try {
        await mongoose.connect(uri);
        const users = await User.find({});
        fs.writeFileSync('users_dump.json', JSON.stringify(users, null, 2));
        console.log('Dumped users to users_dump.json');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

dumpUsers();
