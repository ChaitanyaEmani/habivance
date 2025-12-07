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
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║         FETCHING PERSONALIZED RECOMMENDATIONS                  ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    const user = req.user;

    // Check if user has required profile data
    if (!user.bmiCategory) {
      // Calculate BMI if height and weight are available
      if (user.height && user.weight) {
        const { bmi, category } = calculateBMI(user.height, user.weight);
        user.bmi = bmi;
        user.bmiCategory = category;
        
        console.log('📊 BMI Calculated:');
        console.log(`   BMI: ${bmi}`);
        console.log(`   Category: ${category}\n`);
        
        // Update user in database
        await user.save();
      } else {
        console.log('❌ Missing profile data: height and weight required\n');
        return res.status(400).json({
          success: false,
          message: 'Please complete your profile with height and weight to get recommendations',
          missingFields: ['height', 'weight']
        });
      }
    }

    if (!user.goals) {
      console.log('❌ Missing profile data: goals required\n');
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
      console.log('❌ Invalid user profile:');
      console.log(JSON.stringify(validation.errors, null, 2));
      console.log('\n');
      return res.status(400).json({
        success: false,
        message: 'Invalid user profile',
        errors: validation.errors
      });
    }

    console.log('👤 User Profile:');
    console.log(`   Email: ${user.email}`);
    console.log(`   BMI Category: ${userProfile.bmiCategory}`);
    console.log(`   Health Issues: ${userProfile.healthIssues.length > 0 ? userProfile.healthIssues.join(', ') : 'None'}`);
    console.log(`   Goals: ${userProfile.goals}\n`);

    console.log('🔄 Requesting recommendations from ML service...\n');

    // Get recommendations from ML service
    const result = await getHabitRecommendations(userProfile, 8);
    
    console.log('📦 ML Service Response:');
    console.log(JSON.stringify(result, null, 2));
    console.log('\n');

    if (!result.success) {
      console.log('❌ Failed to get recommendations:');
      console.log(`   Message: ${result.message}`);
      console.log(`   Error: ${result.error}\n`);
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

    console.log('✅ SUCCESS!');
    console.log(`   Source: ${result.metadata.fallbackUsed ? 'FALLBACK SYSTEM' : 'ML MODEL'}`);
    console.log(`   Total Recommendations: ${result.recommendations.length}\n`);

    console.log('📋 RECOMMENDATIONS LIST:');
    console.log('─────────────────────────────────────────────────────────────────');
    result.recommendations.forEach((rec, index) => {
      console.log(`\n${index + 1}. ${rec.habitName}`);
      console.log(`   Score: ${rec.score ? rec.score.toFixed(4) : 'N/A'}`);
      console.log(`   Category: ${rec.category || 'N/A'}`);
      console.log(`   Description: ${rec.description}`);
      console.log(`   Source: ${rec.source || 'N/A'}`);
    });
    console.log('\n─────────────────────────────────────────────────────────────────\n');

    console.log('📊 Metadata:');
    console.log(JSON.stringify(result.metadata, null, 2));
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║                    RESPONSE SENT                               ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

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
    console.log('\n❌ ERROR in getRecommendations:');
    console.log(`   Message: ${error.message}`);
    console.log(`   Stack: ${error.stack}\n`);
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
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║           FETCHING CUSTOM RECOMMENDATIONS                      ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    const { bmiCategory, healthIssues, goals, topK } = req.body;

    console.log('📥 Request Body:');
    console.log(JSON.stringify(req.body, null, 2));
    console.log('\n');

    // Validate input
    if (!bmiCategory || !goals) {
      console.log('❌ Missing required fields:');
      console.log(`   bmiCategory: ${bmiCategory || 'MISSING'}`);
      console.log(`   goals: ${goals || 'MISSING'}\n`);
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
      console.log('❌ Invalid input:');
      console.log(JSON.stringify(validation.errors, null, 2));
      console.log('\n');
      return res.status(400).json({
        success: false,
        message: 'Invalid input',
        errors: validation.errors
      });
    }

    console.log('📝 Custom Profile:');
    console.log(`   BMI Category: ${userProfile.bmiCategory}`);
    console.log(`   Health Issues: ${userProfile.healthIssues.length > 0 ? userProfile.healthIssues.join(', ') : 'None'}`);
    console.log(`   Goals: ${userProfile.goals}`);
    console.log(`   Top K: ${topK || 5}\n`);

    console.log('🔄 Requesting custom recommendations from ML service...\n');

    // Get recommendations
    const result = await getHabitRecommendations(userProfile, topK || 5);

    console.log('\n═══════════════ ML CUSTOM RESPONSE ═══════════════');
    console.log(JSON.stringify(result, null, 2));
    console.log('══════════════════════════════════════════════════\n');

    if (!result.success) {
      console.log('❌ Failed to get custom recommendations:');
      console.log(`   Message: ${result.message}`);
      console.log(`   Error: ${result.error}\n`);
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

    console.log('✅ SUCCESS!');
    console.log(`   Source: ${result.metadata.fallbackUsed ? 'FALLBACK SYSTEM' : 'ML MODEL'}`);
    console.log(`   Total Recommendations: ${result.recommendations.length}\n`);

    console.log('📋 CUSTOM RECOMMENDATIONS LIST:');
    console.log('─────────────────────────────────────────────────────────────────');
    result.recommendations.forEach((rec, index) => {
      console.log(`\n${index + 1}. ${rec.habitName}`);
      console.log(`   Score: ${rec.score ? rec.score.toFixed(4) : 'N/A'}`);
      console.log(`   Category: ${rec.category || 'N/A'}`);
      console.log(`   Description: ${rec.description}`);
      console.log(`   Source: ${rec.source || 'N/A'}`);
    });
    console.log('\n─────────────────────────────────────────────────────────────────\n');

    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                    RESPONSE SENT                               ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

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
    console.log('\n❌ ERROR in getCustomRecommendations:');
    console.log(`   Message: ${error.message}`);
    console.log(`   Stack: ${error.stack}\n`);
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
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║              CHECKING ML SERVICE STATUS                        ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    console.log('🔍 Checking ML service health...\n');

    // Check ML service health
    const healthCheck = await checkMLServiceHealth();

    console.log('📊 Health Check Result:');
    console.log(JSON.stringify(healthCheck, null, 2));
    console.log('\n');

    if (!healthCheck.isHealthy) {
      console.log('❌ ML SERVICE UNHEALTHY');
      console.log(`   Error: ${healthCheck.error}`);
      console.log('   💡 Suggestion: Ensure Flask ML server is running on port 5001\n');
      return res.status(503).json({
        success: false,
        message: 'ML service is not available',
        status: 'unhealthy',
        error: healthCheck.error,
        suggestion: 'Please ensure the Flask ML server is running on port 5001'
      });
    }

    console.log('✅ ML SERVICE HEALTHY\n');
    console.log('🔍 Fetching model info...\n');

    // Get model info
    const modelInfoResult = await getModelInfo();

    console.log('📊 Model Info Result:');
    console.log(JSON.stringify(modelInfoResult, null, 2));
    console.log('\n');

    if (modelInfoResult.success) {
      console.log('✅ MODEL INFO RETRIEVED');
      console.log('   Model Details:');
      const modelInfo = modelInfoResult.data;
      Object.keys(modelInfo).forEach(key => {
        console.log(`   ${key}: ${JSON.stringify(modelInfo[key])}`);
      });
      console.log('\n');
    }

    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║              ML SERVICE STATUS - HEALTHY ✅                    ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

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
    console.log('\n❌ ERROR in checkMLStatus:');
    console.log(`   Message: ${error.message}`);
    console.log(`   Stack: ${error.stack}\n`);
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