// models/User.js
// Purpose: Defines user profile structure
// Fields: name, email, password, age, height, weight, healthIssues, bmi, goals
// Contains: Mongoose schema + password hashing methods

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    age: {
      type: Number,
      min: 1,
      max: 120,
    },
    height: {
      type: Number, // in cm
      min: [50, "Please enter height in centimeters (cm)"],
      max: [300, "Height cannot exceed 300 cm"]
    },
    weight: {
      type: Number, // in kg
      min: 10,
      max: 500,
    },
    healthIssues: {
      type: [String],
      default: [],
    },
    bmi: {
      type: Number,
      default: null,
    },
    bmiCategory: {
      type: String,
      enum: ['Underweight', 'Normal', 'Overweight', 'Obese', null],
      default: null,
    },
    goals: {
      type: String,
      default: '',
    }
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  // If password is not modified, do nothing
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;