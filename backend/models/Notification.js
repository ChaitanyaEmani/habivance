// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    default: 'GENERAL'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Index for fast queries
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

// Delete unread notifications older than 24 hours automatically
notificationSchema.index({ createdAt: 1 }, {
  expireAfterSeconds: 86400, // 24 hours
  partialFilterExpression: { isRead: false }
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;