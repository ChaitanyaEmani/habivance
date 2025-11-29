// Purpose: User's daily habit instances (habits added to their plan)
// Fields: userId, habitId, date, scheduledTime, status (pending/in-progress/completed/skipped), actualDuration, startTime, endTime
// Contains: References to User and Habit models

import mongoose from 'mongoose';

const dailyHabitSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    scheduledTime: {
      type: String, // e.g., "07:00"
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'skipped'],
      default: 'pending',
    },
    startTime: {
      type: Date,
      default: null,
    },
    endTime: {
      type: Date,
      default: null,
    },
    actualDuration: {
      type: Number, // in minutes
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
dailyHabitSchema.index({ userId: 1, date: 1 });
dailyHabitSchema.index({ userId: 1, habitId: 1 });

const DailyHabit = mongoose.model('DailyHabit', dailyHabitSchema);

export default DailyHabit;