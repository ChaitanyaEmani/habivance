// Purpose: Get personalized habit suggestions for user
// Routes: GET /recommendations
// Actions: Call recommendationService → return filtered habits based on user health profile

import * as recommendationService from '../services/recommendationService.js';

export const getRecommendations = async (req, res) => {
  try {
    const { limit } = req.query;
    
    let recommendations;
    if (limit) {
      recommendations = await recommendationService.getTopRecommendations(
        req.user._id,
        parseInt(limit)
      );
    } else {
      recommendations = await recommendationService.getRecommendationsForUser(req.user._id);
    }

    res.status(200).json({
      success: true,
      message: 'Recommendations retrieved successfully',
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve recommendations',
    });
  }
};