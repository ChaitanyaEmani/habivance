// backend/services/recommendationService.js
// Purpose: Interface with Flask ML API for habit recommendations

import axios from 'axios';

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5001';
const ML_API_TIMEOUT = 10000; // 10 seconds

/**
 * Check if ML service is healthy
 */
export const checkMLServiceHealth = async () => {
  try {
    const response = await axios.get(`${ML_API_URL}/health`, {
      timeout: 5000
    });
    return {
      isHealthy: true,
      data: response.data
    };
  } catch (error) {
    console.error('ML service health check failed:', error.message);
    return {
      isHealthy: false,
      error: error.message
    };
  }
};

/**
 * Get habit recommendations from ML model
 * @param {Object} userProfile - User profile data
 * @param {string} userProfile.bmiCategory - BMI category (Underweight, Normal, Overweight, Obese)
 * @param {string[]} userProfile.healthIssues - Array of health issues
 * @param {string} userProfile.goals - User's goals
 * @param {number} topK - Number of recommendations to fetch (default: 5)
 * @returns {Promise<Object>} Recommendations and metadata
 */
export const getHabitRecommendations = async (userProfile, topK = 5) => {
  try {
    // Validate input
    if (!userProfile.bmiCategory) {
      throw new Error('BMI category is required');
    }

    if (!userProfile.goals) {
      throw new Error('Goals are required');
    }

    // Prepare request payload
    const payload = {
      bmiCategory: userProfile.bmiCategory,
      healthIssues: userProfile.healthIssues || [],
      goals: userProfile.goals,
      topK: topK
    };

    console.log('Requesting ML predictions with payload:', payload);

    // Call ML API
    const response = await axios.post(
      `${ML_API_URL}/predict`,
      payload,
      {
        timeout: ML_API_TIMEOUT,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Check if response is successful
    if (!response.data.success) {
      throw new Error(response.data.message || 'ML prediction failed');
    }

    const { recommendations, input } = response.data.data;

    console.log(`✓ Received ${recommendations.length} recommendations from ML service`);
    console.log('ML Recommendations:', JSON.stringify(recommendations, null, 2));

    return {
      success: true,
      recommendations: recommendations.map(rec => ({
        habit: rec.habit,
        category: rec.category,
        duration: rec.duration,
        confidence: rec.confidence,
        description: rec.description,
        source: 'ml_model'
      })),
      metadata: {
        input: input,
        modelUsed: true,
        timestamp: new Date().toISOString()
      }
    };

  } catch (error) {
    console.error('❌ Error fetching ML recommendations:', error.message);
    console.error('Error details:', {
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });

    // Check if it's a connection error
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.log('⚠️  ML service unavailable, using fallback recommendations');
      return getFallbackRecommendations(userProfile, topK);
    }

    // Check if it's a timeout
    if (error.code === 'ECONNABORTED') {
      console.log('⚠️  ML service timeout, using fallback recommendations');
      return getFallbackRecommendations(userProfile, topK);
    }

    // For 400/500 errors, try to use fallback
    if (error.response?.status >= 400) {
      console.log('⚠️  ML prediction failed with status', error.response.status, ', using fallback');
      return getFallbackRecommendations(userProfile, topK);
    }

    // For other errors, try fallback
    console.log('⚠️  ML prediction failed, using fallback recommendations');
    return getFallbackRecommendations(userProfile, topK);
  }
};

/**
 * Get model information and performance metrics
 */
export const getModelInfo = async () => {
  try {
    const response = await axios.get(`${ML_API_URL}/model-info`, {
      timeout: 5000
    });

    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error fetching model info:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Calculate BMI and determine category
 * @param {number} height - Height in cm
 * @param {number} weight - Weight in kg
 * @returns {Object} BMI value and category
 */
export const calculateBMI = (height, weight) => {
  if (!height || !weight || height <= 0 || weight <= 0) {
    return { bmi: null, category: null };
  }

  // Convert height from cm to meters
  const heightInMeters = height / 100;
  
  // Calculate BMI
  const bmi = weight / (heightInMeters * heightInMeters);
  
  // Determine category
  let category;
  if (bmi < 18.5) {
    category = 'Underweight';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Normal';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
  } else {
    category = 'Obese';
  }

  return {
    bmi: parseFloat(bmi.toFixed(2)),
    category
  };
};

/**
 * Validate user profile for recommendations
 */
export const validateUserProfile = (userProfile) => {
  const errors = [];

  if (!userProfile.bmiCategory) {
    errors.push('BMI category is required');
  }

  const validBMICategories = ['Underweight', 'Normal', 'Overweight', 'Obese'];
  if (userProfile.bmiCategory && !validBMICategories.includes(userProfile.bmiCategory)) {
    errors.push(`Invalid BMI category. Must be one of: ${validBMICategories.join(', ')}`);
  }

  if (!userProfile.goals) {
    errors.push('Goals are required');
  }

  if (userProfile.healthIssues && !Array.isArray(userProfile.healthIssues)) {
    errors.push('Health issues must be an array');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Fallback recommendations when ML service is unavailable
 * Simple rule-based recommendations based on BMI category and goals
 */
const getFallbackRecommendations = (userProfile, topK = 5) => {
  const { bmiCategory, healthIssues = [], goals } = userProfile;
  
  console.log('⚠️  Generating FALLBACK recommendations for:', { bmiCategory, goals });
  console.log('Note: ML service should be used in most cases. Fallback is for emergencies only.');

  // Fallback recommendation database
  const fallbackDB = {
    'Underweight': {
      'Weight Gain': [
        { habit: 'High-protein breakfast', category: 'Diet', duration: 30, description: 'Start your day with eggs, nuts, and whole grains' },
        { habit: 'Strength training 3x per week', category: 'Fitness', duration: 45, description: 'Build muscle mass with resistance exercises' },
        { habit: 'Calorie-dense smoothies', category: 'Diet', duration: 20, description: 'Drink nutrient-rich smoothies between meals' },
        { habit: 'Frequent small meals', category: 'Diet', duration: 15, description: 'Eat 5-6 small meals throughout the day' },
        { habit: 'Iron-rich foods daily', category: 'Diet', duration: 25, description: 'Include spinach, lentils, and lean meats' }
      ],
      'Muscle Gain': [
        { habit: 'Strength training 3x per week', category: 'Fitness', duration: 45, description: 'Progressive overload weight training' },
        { habit: 'High-protein breakfast', category: 'Diet', duration: 30, description: 'Consume 20-30g protein at breakfast' },
        { habit: 'Post-workout protein', category: 'Diet', duration: 15, description: 'Protein shake within 30 minutes of workout' },
        { habit: 'Calorie surplus diet', category: 'Diet', duration: 30, description: 'Eat 300-500 calories above maintenance' }
      ],
      'General Health': [
        { habit: '30-minute daily walk', category: 'Fitness', duration: 30, description: 'Light cardio to improve circulation' },
        { habit: 'Vitamin supplements', category: 'Health', duration: 5, description: 'Take vitamin D and B12 daily' },
        { habit: 'Drink 8 glasses water', category: 'Health', duration: 10, description: 'Stay hydrated throughout the day' },
        { habit: 'Iron-rich foods daily', category: 'Diet', duration: 25, description: 'Combat fatigue with iron-rich diet' }
      ]
    },
    'Normal': {
      'General Health': [
        { habit: '30-minute daily walk', category: 'Fitness', duration: 30, description: 'Maintain cardiovascular health' },
        { habit: 'Drink 8 glasses water', category: 'Health', duration: 10, description: 'Stay properly hydrated' },
        { habit: 'Eat fruits and vegetables', category: 'Diet', duration: 30, description: '5 servings of fruits and veggies daily' },
        { habit: '7-8 hours sleep', category: 'Health', duration: 480, description: 'Maintain consistent sleep schedule' },
        { habit: 'Limit processed foods', category: 'Diet', duration: 20, description: 'Choose whole foods over processed' }
      ],
      'Fitness Goal': [
        { habit: 'Resistance training 4x week', category: 'Fitness', duration: 60, description: 'Build and maintain muscle mass' },
        { habit: '30-minute daily walk', category: 'Fitness', duration: 30, description: 'Daily cardio for heart health' },
        { habit: 'Morning stretching', category: 'Fitness', duration: 15, description: 'Improve flexibility and prevent injury' },
        { habit: 'Yoga practice daily', category: 'Fitness', duration: 30, description: 'Balance, flexibility, and mindfulness' }
      ],
      'Mental Health': [
        { habit: '10-minute meditation', category: 'Mental Health', duration: 10, description: 'Daily mindfulness practice' },
        { habit: 'Yoga practice daily', category: 'Fitness', duration: 30, description: 'Mind-body connection' },
        { habit: '7-8 hours sleep', category: 'Health', duration: 480, description: 'Quality sleep for mental wellbeing' },
        { habit: 'Regular work breaks', category: 'Mental Health', duration: 5, description: 'Take breaks every 60-90 minutes' }
      ]
    },
    'Overweight': {
      'Weight Loss': [
        { habit: '45-minute brisk walk', category: 'Fitness', duration: 45, description: 'Daily cardio for fat burning' },
        { habit: 'Low-carb diet', category: 'Diet', duration: 40, description: 'Reduce refined carbs and sugars' },
        { habit: 'Reduce sugar intake', category: 'Diet', duration: 15, description: 'Limit added sugar to under 25g daily' },
        { habit: 'Track calorie intake', category: 'Health', duration: 10, description: 'Monitor daily food consumption' },
        { habit: 'Portion control', category: 'Diet', duration: 20, description: 'Use smaller plates and mindful eating' },
        { habit: 'Replace sugary drinks', category: 'Diet', duration: 5, description: 'Drink water instead of soda' },
        { habit: 'HIIT workouts 3x week', category: 'Fitness', duration: 20, description: 'High-intensity interval training' }
      ],
      'General Health': [
        { habit: '45-minute brisk walk', category: 'Fitness', duration: 45, description: 'Improve cardiovascular health' },
        { habit: 'Low sodium diet', category: 'Diet', duration: 15, description: 'Reduce blood pressure naturally' },
        { habit: 'Fiber-rich foods', category: 'Diet', duration: 25, description: 'Eat oats, beans, and vegetables' },
        { habit: 'Meal prep weekly', category: 'Diet', duration: 60, description: 'Plan healthy meals in advance' }
      ]
    },
    'Obese': {
      'Weight Loss': [
        { habit: 'Doctor-supervised cardio', category: 'Fitness', duration: 30, description: 'Safe cardio under medical guidance' },
        { habit: 'Low-sodium DASH diet', category: 'Diet', duration: 45, description: 'Heart-healthy eating plan' },
        { habit: 'Monitor blood sugar', category: 'Health', duration: 10, description: 'Check glucose levels regularly' },
        { habit: 'Eliminate refined carbs', category: 'Diet', duration: 30, description: 'Remove white bread, pasta, and sugar' },
        { habit: 'Water aerobics 4x week', category: 'Fitness', duration: 45, description: 'Low-impact joint-friendly exercise' },
        { habit: 'Blood pressure monitoring', category: 'Health', duration: 5, description: 'Daily BP checks' },
        { habit: 'Omega-3 rich foods', category: 'Diet', duration: 25, description: 'Salmon, walnuts for heart health' },
        { habit: 'Breathing exercises', category: 'Health', duration: 10, description: 'Improve lung capacity' }
      ],
      'General Health': [
        { habit: 'Doctor-supervised cardio', category: 'Fitness', duration: 30, description: 'Safe exercise program' },
        { habit: 'Low-sodium DASH diet', category: 'Diet', duration: 45, description: 'Reduce blood pressure' },
        { habit: 'Blood pressure monitoring', category: 'Health', duration: 5, description: 'Track cardiovascular health' },
        { habit: 'Water aerobics 4x week', category: 'Fitness', duration: 45, description: 'Gentle full-body exercise' }
      ],
      'Mental Health': [
        { habit: 'Therapy weekly', category: 'Mental Health', duration: 60, description: 'Professional counseling support' },
        { habit: 'Mindfulness meditation', category: 'Mental Health', duration: 20, description: 'Manage stress and emotions' },
        { habit: '7-8 hours sleep', category: 'Health', duration: 480, description: 'Quality sleep for mental health' }
      ]
    }
  };

  // Normalize goals to title case for matching
  const normalizedGoals = goals.toLowerCase().split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Get recommendations for the BMI category and goals
  let recommendations = fallbackDB[bmiCategory]?.[normalizedGoals] || 
                       fallbackDB[bmiCategory]?.['General Health'] || 
                       [];

  // If no specific recommendations found, use general healthy habits
  if (recommendations.length === 0) {
    recommendations = [
      { habit: '30-minute daily walk', category: 'Fitness', duration: 30, description: 'Basic cardio for everyone' },
      { habit: 'Drink 8 glasses water', category: 'Health', duration: 10, description: 'Stay hydrated' },
      { habit: 'Eat fruits and vegetables', category: 'Diet', duration: 30, description: 'Balanced nutrition' },
      { habit: '7-8 hours sleep', category: 'Health', duration: 480, description: 'Quality rest' },
      { habit: '10-minute meditation', category: 'Mental Health', duration: 10, description: 'Stress management' }
    ];
  }

  // Limit to topK recommendations
  const limitedRecommendations = recommendations.slice(0, topK);

  console.log('✓ Fallback Recommendations:', JSON.stringify(limitedRecommendations, null, 2));

  return {
    success: true,
    recommendations: limitedRecommendations.map((rec, index) => ({
      ...rec,
      confidence: 0.7 - (index * 0.05), // Simulated confidence scores
      source: 'fallback'
    })),
    metadata: {
      input: { bmiCategory, healthIssues, goals },
      modelUsed: false,
      fallbackUsed: true,
      timestamp: new Date().toISOString()
    }
  };
};

export default {
  checkMLServiceHealth,
  getHabitRecommendations,
  getModelInfo,
  calculateBMI,
  validateUserProfile
};