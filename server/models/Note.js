const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
<<<<<<< Updated upstream
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [String],
=======
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    text: { type: String, required: true },
    link: { type: String },
>>>>>>> Stashed changes
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
