const mongoose = require('mongoose');
console.log('Mongoose version:', mongoose.version);
console.log('Schema exists:', !!mongoose.Schema);
if (mongoose.Schema) {
    console.log('Types exists:', !!mongoose.Schema.Types);
    if (mongoose.Schema.Types) {
        console.log('ObjectId exists:', !!mongoose.Schema.Types.ObjectId);
    }
}
process.exit(0);
