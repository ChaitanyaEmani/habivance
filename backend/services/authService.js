// Purpose: Authentication business logic
// Functions: registerUser(), loginUser(), verifyToken()
// Logic: Hash passwords, compare passwords, generate JWT tokens

// services/authService.js
import User from '../models/User.js';
import { generateToken } from '../utils/tokenGenerator.js';
import { sendWelcomeEmail } from '../utils/emailService.js';
import { calculateBMI, getHealthRisk } from "../utils/bmiCalculator.js";

export const registerUser = async (userData) => {
  try {
    const { name, email, password, age, height, weight, healthIssues, goals } = userData;

    const userExists = await User.findOne({ email });
    if (userExists) throw new Error('User already exists');

    // 1️⃣ Calculate BMI here
    const { bmi, category } = calculateBMI(height, weight);
    const healthRisk = getHealthRisk(bmi, age);

    // 2️⃣ Create user with BMI added
    const user = await User.create({
      name,
      email,
      password,
      age,
      height,
      weight,
      healthIssues,
      goals,
      bmi: bmi,
      bmiCategory: category,
      healthRisk
    });

    if (!user) {
      throw new Error('Invalid user data');
    }

    sendWelcomeEmail(email, name).catch(err =>
      console.error('Welcome email failed:', err)
    );

    const token = generateToken(user._id);

    const cleanUser = user.toObject();
    delete cleanUser.password;

    return {
      user: cleanUser,
      token,
    };
  } catch (error) {
    console.error('Error in registerUser:', error);
    throw new Error(error.message || 'Failed to register user');
  }
};

export const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user._id);

    // Convert Mongoose doc → plain object
    const userData = user.toObject();

    // Remove password before returning
    delete userData.password;

    return {
      user: userData,
      token: token,
    };
  } catch (error) {
    console.error('Error in loginUser:', error);
    throw new Error(error.message || 'Failed to login user');
  }
};

export const verifyUserToken = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error('Error in verifyUserToken:', error);
    throw new Error(error.message || 'Failed to verify user token');
  }
};