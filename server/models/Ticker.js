const mongoose = require('mongoose');

const tickerSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    priority: {
        type: String,
        enum: ['normal', 'high', 'urgent'],
        default: 'normal'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Ticker', tickerSchema);
