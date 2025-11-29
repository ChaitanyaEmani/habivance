// GET /api/recommendations → recommendationController.getRecommendations

import express from 'express';
import { getRecommendations } from '../controllers/recommendationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// @route   GET /api/recommendations
// @desc    Get personalized habit recommendations for user
// @query   limit - Optional: Number of recommendations to return
// @access  Private
router.get('/', getRecommendations);

export default router;