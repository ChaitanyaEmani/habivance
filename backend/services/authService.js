// services/authService.js
import User from '../models/User.js';
import { generateToken } from '../utils/tokenGenerator.js';
import { sendWelcomeEmail } from '../utils/emailService.js';
import { calculateBMI, getHealthRisk } from "../utils/bmiCalculator.js";
import { getHabitRecommendations } from './recommendationService.js';


// ---------------- REGISTER USER ----------------
export const registerUser = async (userData) => {
  try {
    const { name, email, password, age, height, weight, healthIssues, goals } = userData;

    // 🔹 Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) throw new Error('User already exists');

    // 🔹 Calculate BMI
    const { bmi, category } = calculateBMI(height, weight);
    const healthRisk = getHealthRisk(bmi, age);

    // 🔹 Create user
    const user = await User.create({
      name,
      email,
      password,
      age,
      height,
      weight,
      healthIssues,
      goals,
      bmi,
      bmiCategory: category,
      healthRisk,
    });

    if (!user) throw new Error("Invalid user data");

    // 🔹 Habit recommendations
    let recommendations = [];
    try {
      recommendations = await getHabitRecommendations({
        age,
        bmi,
        bmiCategory: category,
        healthIssues: healthIssues || [],
        goals: goals || '',
        weight,
        height
      });
    } catch (err) {
      console.log("Recommendation error:", err);
    }

    // 🔹 Send welcome mail (non-blocking)
    sendWelcomeEmail(email, name).catch(err => console.log("Email error:", err));

    const token = generateToken(user._id);

    const cleanUser = user.toObject();
    delete cleanUser.password;

    return {
      user: cleanUser,
      token,
      recommendations,
    };

  } catch (error) {
    throw new Error(error.message || "Registration failed");
  }
};




// ---------------- LOGIN USER ----------------
export const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email }).select('+password');

    // 🔹 Email not found
    if (!user) {
      throw new Error("Email not found");
    }

    // 🔹 Password incorrect
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new Error("Incorrect password");
    }

    // 🔹 Generate token
    const token = generateToken(user._id);

    const userData = user.toObject();
    delete userData.password;

    return {
      user: userData,
      token,
    };

  } catch (error) {
    throw new Error(error.message || "Login failed");
  }
};

