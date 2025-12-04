// Purpose: User profile business logic
// Functions: getUserById(), updateUserProfile(), deleteUser()
// Logic: Calculate BMI, validate health data, update user info

import User from '../models/User.js';
import { calculateBMI } from '../utils/bmiCalculator.js';

export const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updateData) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Update fields
    user.name = updateData.name || user.name;
    user.email = updateData.email || user.email;
    user.age = updateData.age !== undefined ? updateData.age : user.age;
    user.height = updateData.height !== undefined ? updateData.height : user.height;
    user.weight = updateData.weight !== undefined ? updateData.weight : user.weight;
    user.healthIssues = updateData.healthIssues || user.healthIssues;
    user.goals = updateData.goals !== undefined ? updateData.goals : user.goals;

    // Recalculate BMI if height or weight changed
    if (user.height && user.weight) {
      try {
        const { bmi, category } = calculateBMI(user.height, user.weight);
        user.bmi = bmi;
        user.bmiCategory = category;
      } catch (bmiError) {
        console.error('Error calculating BMI:', bmiError);
        // Continue without BMI update if calculation fails
      }
    }

    // Handle profile image if provided
    // if (updateData.profileImage) {
    //   try {
    //     user.profileImage = {
    //       data: Buffer.from(updateData.profileImage, 'base64'),
    //       contentType: updateData.imageType || 'image/jpeg',
    //     };
    //   } catch (imageError) {
    //     console.error('Error processing profile image:', imageError);
    //     throw new Error('Invalid profile image format');
    //   }
    // }

    const updatedUser = await user.save();

    return {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      age: updatedUser.age,
      height: updatedUser.height,
      weight: updatedUser.weight,
      healthIssues: updatedUser.healthIssues,
      bmi: updatedUser.bmi,
      bmiCategory: updatedUser.bmiCategory,
      goals: updatedUser.goals,
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    await user.deleteOne();
    return { message: 'User deleted successfully' };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// export const getUserProfileImage = async (userId) => {
//   try {
//     const user = await User.findById(userId).select('profileImage');

//     if (!user || !user.profileImage || !user.profileImage.data) {
//       throw new Error('Profile image not found');
//     }

//     return {
//       image: user.profileImage.data,
//       contentType: user.profileImage.contentType,
//     };
//   } catch (error) {
//     console.error('Error getting user profile image:', error);
//     throw error;
//   }
// };