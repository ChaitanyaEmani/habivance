// Purpose: Manage user profile operations
// Routes: GET /profile, PUT /profile, DELETE /profile
// Actions: Get user data, update profile, calculate BMI

import * as userService from '../services/userService.js';

export const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: error.message || 'Profile not found',
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserProfile(req.user._id, req.body);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update profile',
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete profile',
    });
  }
};

export const getProfileImage = async (req, res) => {
  try {
    const { image, contentType } = await userService.getUserProfileImage(req.user._id);
    res.set('Content-Type', contentType);
    res.send(image);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: error.message || 'Profile image not found',
    });
  }
};