const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

console.log('--- CHECKING DATABASES ---');

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const admin = new mongoose.mongo.Admin(mongoose.connection.db);
        const list = await admin.listDatabases();

        console.log('\nAvailable Databases:');
        list.databases.forEach(db => {
            console.log(`- ${db.name} \t(Size: ${db.sizeOnDisk})`);
        });

        console.log(`\nCurrent Connection uses Database: "${mongoose.connection.name}"`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        mongoose.disconnect();
    }
}

run();
