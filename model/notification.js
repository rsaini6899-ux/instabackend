const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // title: { type: String, required: true },
    message: { type: String },
    // type: { type: String, enum: ['comment', 'like', 'message'], required: true },
    // link: { type: String },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  });
  
 module.exports = mongoose.model('Notification', notificationSchema);
  