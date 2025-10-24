const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, required: true }, // e.g., "Notification", "Transaction"
    createdAt: { type: Date, default: Date.now },
    data: { type: Object }, // Report ke details yaha store honge
});

module.exports = mongoose.model('Report', reportSchema);
