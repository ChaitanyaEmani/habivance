// Purpose: Store scheduled alerts for habits
// Fields: userId, habitId, alertTime, message, isRead, type (reminder/completion)

import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: true,
    },
    dailyHabitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DailyHabit',
      default: null,
    },
    alertTime: {
      type: Date,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['reminder', 'completion', 'streak', 'motivation'],
      default: 'reminder',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ alertTime: 1, isSent: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;