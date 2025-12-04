// backend/controllers/recommendationController.js
// Purpose: Handle habit recommendation requests

import {
  getHabitRecommendations,
  checkMLServiceHealth,
  getModelInfo,
  validateUserProfile,
  calculateBMI
} from '../services/recommendationService.js';

/**
 * @desc    Get personalized habit recommendations for logged-in user
 * @route   GET /api/habits/recommendations
 * @access  Private
 */
export const getRecommendations = async (req, res) => {
  try {
    const user = req.user;

    // Check if user has required profile data
    if (!user.bmiCategory) {
      // Calculate BMI if height and weight are available
      if (user.height && user.weight) {
        const { bmi, category } = calculateBMI(user.height, user.weight);
        user.bmi = bmi;
        user.bmiCategory = category;
        
        // Update user in database
        await user.save();
      } else {
        return res.status(400).json({
          success: false,
          message: 'Please complete your profile with height and weight to get recommendations',
          missingFields: ['height', 'weight']
        });
      }
    }

    if (!user.goals) {
      return res.status(400).json({
        success: false,
        message: 'Please set your goals to get personalized recommendations',
        missingFields: ['goals']
      });
    }

    // Prepare user profile for ML service
    const userProfile = {
      bmiCategory: user.bmiCategory,
      healthIssues: user.healthIssues || [],
      goals: user.goals
    };

    // Validate profile
    const validation = validateUserProfile(userProfile);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user profile',
        errors: validation.errors
      });
    }

    console.log(`Fetching recommendations for user: ${user.email}`);
    console.log('User Profile:', {
      bmiCategory: userProfile.bmiCategory,
      healthIssues: userProfile.healthIssues,
      goals: userProfile.goals
    });

    // Get recommendations from ML service
    const result = await getHabitRecommendations(userProfile, 8);

    if (!result.success) {
      return res.status(503).json({
        success: false,
        message: result.message || 'Failed to get recommendations',
        error: result.error
      });
    }

    // Prepare response message
    const message = result.metadata.fallbackUsed 
      ? 'Recommendations generated using fallback system (ML service unavailable)'
      : 'Recommendations fetched successfully from ML model';

    console.log(`✓ Returning ${result.recommendations.length} recommendations (Source: ${result.recommendations[0]?.source})`);

    // Return recommendations
    return res.status(200).json({
      success: true,
      message: message,
      data: {
        recommendations: result.recommendations,
        userProfile: {
          bmiCategory: user.bmiCategory,
          bmi: user.bmi,
          healthIssues: user.healthIssues,
          goals: user.goals
        },
        metadata: result.metadata
      }
    });

  } catch (error) {
    console.error('Error in getRecommendations:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching recommendations',
      error: error.message
    });
  }
};

/**
 * @desc    Get recommendations based on custom input (for preview/testing)
 * @route   POST /api/habits/recommendations/custom
 * @access  Private
 */
export const getCustomRecommendations = async (req, res) => {
  try {
    const { bmiCategory, healthIssues, goals, topK } = req.body;

    // Validate input
    if (!bmiCategory || !goals) {
      return res.status(400).json({
        success: false,
        message: 'bmiCategory and goals are required',
        received: { bmiCategory, goals }
      });
    }

    // Prepare profile
    const userProfile = {
      bmiCategory,
      healthIssues: healthIssues || [],
      goals
    };

    // Validate profile
    const validation = validateUserProfile(userProfile);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input',
        errors: validation.errors
      });
    }

    console.log('Fetching custom recommendations with profile:', userProfile);

    // Get recommendations
    const result = await getHabitRecommendations(userProfile, topK || 5);

    if (!result.success) {
      return res.status(503).json({
        success: false,
        message: result.message || 'Failed to get recommendations',
        error: result.error
      });
    }

    // Prepare response message
    const message = result.metadata.fallbackUsed 
      ? 'Custom recommendations generated using fallback system'
      : 'Custom recommendations fetched successfully from ML model';

    return res.status(200).json({
      success: true,
      message: message,
      data: {
        recommendations: result.recommendations,
        input: userProfile,
        metadata: result.metadata
      }
    });

  } catch (error) {
    console.error('Error in getCustomRecommendations:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching custom recommendations',
      error: error.message
    });
  }
};

/**
 * @desc    Check ML service status
 * @route   GET /api/habits/ml-status
 * @access  Private
 */
export const checkMLStatus = async (req, res) => {
  try {
    // Check ML service health
    const healthCheck = await checkMLServiceHealth();

    if (!healthCheck.isHealthy) {
      return res.status(503).json({
        success: false,
        message: 'ML service is not available',
        status: 'unhealthy',
        error: healthCheck.error,
        suggestion: 'Please ensure the Flask ML server is running on port 5001'
      });
    }

    // Get model info
    const modelInfoResult = await getModelInfo();

    return res.status(200).json({
      success: true,
      message: 'ML service is running',
      status: 'healthy',
      data: {
        health: healthCheck.data,
        modelInfo: modelInfoResult.success ? modelInfoResult.data : null
      }
    });

  } catch (error) {
    console.error('Error in checkMLStatus:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking ML service status',
      error: error.message
    });
  }
};

export default {
  getRecommendations,
  getCustomRecommendations,
  checkMLStatus
};