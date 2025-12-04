// Purpose: Manage user profile operations
// Routes: GET /profile, PUT /profile, DELETE /profile
// Actions: Get user data, update profile, calculate BMI

import notificationService from '../services/notificationService.js';
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

    // Create notification after profile update (non-blocking)
    notificationService.create(
      req.user._id,
      'Profile Updated ✅',
      'Your profile has been successfully updated',
      'PROFILE_UPDATED',
      'low'
    ).then(() => {
      console.log('✅ Profile update notification created for user:', req.user._id);
    }).catch(err => {
      console.error('❌ Failed to create profile notification:', err.message);
    });

    // If BMI was calculated, send BMI notification
    if (updatedUser.bmi) {
      const riskLevel = updatedUser.bmi < 18.5 ? 'Underweight' 
        : updatedUser.bmi < 25 ? 'Normal' 
        : updatedUser.bmi < 30 ? 'Overweight' 
        : 'Obese';
      
      const priority = riskLevel === 'Normal' ? 'low' : 'medium';
      
      notificationService.create(
        req.user._id,
        'BMI Calculated 📊',
        `Your BMI is ${updatedUser.bmi} (${riskLevel}). ${riskLevel === 'Normal' ? 'Keep up the good work!' : 'Consider consulting a healthcare professional.'}`,
        'BMI_CALCULATED',
        priority
      ).then(() => {
        console.log('✅ BMI notification created for user:', req.user._id);
      }).catch(err => {
        console.error('❌ Failed to create BMI notification:', err.message);
      });
    }

    // If email or password was changed, send security notification
    if (req.body.email || req.body.password) {
      notificationService.create(
        req.user._id,
        'Security Update 🔒',
        req.body.email ? 'Your email address has been changed' : 'Your password has been changed',
        'SECURITY_UPDATE',
        'high'
      ).then(() => {
        console.log('✅ Security notification created for user:', req.user._id);
      }).catch(err => {
        console.error('❌ Failed to create security notification:', err.message);
      });
    }

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
    const user = await userService.getUserById(req.user._id);
    const result = await userService.deleteUser(req.user._id);
    
    // Create farewell notification (it will be auto-deleted with user cascade if you have that setup)
    notificationService.create(
      req.user._id,
      'Account Deleted 👋',
      `Goodbye ${user.name || 'User'}! Your account has been permanently deleted. We hope to see you again!`,
      'ACCOUNT_DELETED',
      'high'
    ).then(() => {
      console.log('✅ Account deletion notification created for user:', req.user._id);
    }).catch(err => {
      console.error('❌ Failed to create deletion notification:', err.message);
    });

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