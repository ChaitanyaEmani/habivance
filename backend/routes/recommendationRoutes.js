// routes/habitRoutes.js
// Purpose: Define habit-related API endpoints
import express from 'express';
import { 
  getRecommendations, 
  getCustomRecommendations,
  checkMLStatus 
} from '../controllers/recommendationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get personalized recommendations for logged-in user
// GET /api/habits/recommendations
router.get('/', protect, getRecommendations);

// Get recommendations based on custom input
// POST /api/habits/recommendations/custom
router.post('/recommendations/custom', protect, getCustomRecommendations);

// Check ML model status
// GET /api/habits/ml-status
router.get('/ml-status', protect, checkMLStatus);

export default router;
