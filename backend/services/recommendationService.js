// Purpose: Smart recommendation algorithm
// Functions: getRecommendationsForUser(userId)
// Logic:
// Fetch user profile (age, weight, healthIssues)
// Match habits based on criteria
// Example: If user has "diabetes" → recommend "Low sugar diet"

import User from '../models/User.js';
import Habit from '../models/Habit.js';
import { matchHabits } from '../utils/recommendationEngine.js';

export const getRecommendationsForUser = async (userId) => {
  try {
    // Get user profile
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Get all available habits
    const allHabits = await Habit.find();

    // Get recommendations based on user profile
    const recommendations = matchHabits(user, allHabits);

    return {
      user: {
        name: user.name,
        age: user.age,
        bmi: user.bmi,
        bmiCategory: user.bmiCategory,
        healthIssues: user.healthIssues,
      },
      recommendations: recommendations,
      total: recommendations.length,
    };
  } catch (error) {
    console.error('Error in getRecommendationsForUser:', error);
    throw new Error(error.message || 'Failed to get recommendations for user');
  }
};

export const getTopRecommendations = async (userId, limit = 10) => {
  try {
    const result = await getRecommendationsForUser(userId);
    
    return {
      ...result,
      recommendations: result.recommendations.slice(0, limit),
    };
  } catch (error) {
    console.error('Error in getTopRecommendations:', error);
    throw new Error(error.message || 'Failed to get top recommendations');
  }
};