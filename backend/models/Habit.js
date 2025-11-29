// Purpose: Pre-defined habits database (exercise, diet, health tips)
// Fields: habitName, category, description, recommendedFor, defaultDuration, criteria
// Example: "Walk 2km" for general health, "Eat leafy vegetables" for eye care

import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema(
  {
    habitName: {
      type: String,
      required: [true, 'Habit name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Exercise', 'Diet', 'Health', 'Study', 'Lifestyle', 'Mental Health'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    recommendedFor: {
      type: [String],
      default: [],
    },
    criteria: {
      type: [String],
      default: [],
    },
    defaultDuration: {
      type: Number, // in minutes
      default: 30,
    },
    icon: {
      type: String,
      default: '🎯',
    },
  },
  {
    timestamps: true,
  }
);

const Habit = mongoose.model('Habit', habitSchema);

export default Habit;