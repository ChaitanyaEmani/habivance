// PUT /api/track/:id/complete → trackingController.markCompleted
// PUT /api/track/:id/skip → trackingController.markSkipped

import express from 'express';
import {
  markCompleted,
  markSkipped,
  updateStreak,
  getHabitProgress,
} from '../controllers/trackingController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// @route   PUT /api/track/:id/complete
// @desc    Mark a habit as completed
// @access  Private
router.put('/:id/complete', markCompleted);

// @route   PUT /api/track/:id/skip
// @desc    Mark a habit as skipped
// @access  Private
router.put('/:id/skip', markSkipped);

// @route   PUT /api/track/:id/streak
// @desc    Update habit streak
// @access  Private
router.put('/:id/streak', updateStreak);

// @route   GET /api/track/progress/:habitId
// @desc    Get habit progress over time
// @query   days - Optional: Number of days to analyze (default: 30)
// @access  Private
router.get('/progress/:habitId', getHabitProgress);

export default router;