// Purpose: Handle authentication requests
// Routes: POST /register, POST /login, POST /logout
// Actions: Validate input → call authService → return JWT token

// controllers/authController.js
import * as authService from '../services/authService.js';

export const register = async (req, res) => {
  try {
    const userData = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userData,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await authService.loginUser(email, password);
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: userData,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid credentials',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await authService.verifyUserToken(req.user._id);
    res.status(200).json({
      success: true,
      message: 'User details retrieved successfully',
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: error.message || 'Failed to retrieve user details',
    });
  }
};