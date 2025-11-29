// GET /api/analytics/daily → analyticsController.getDailyAnalytics
// GET /api/analytics/weekly → analyticsController.getWeeklyAnalytics
// GET /api/analytics/streaks → analyticsController.getStreaks

import express from 'express';
import {
  getDailyAnalytics,
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getStreaks,
  getCompletionRate,
} from '../controllers/analyticsController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// @route   GET /api/analytics/daily
// @desc    Get daily statistics
// @query   date - Optional: Specific date in ISO format
// @access  Private
router.get('/daily', getDailyAnalytics);

// @route   GET /api/analytics/weekly
// @desc    Get weekly statistics (last 7 days)
// @access  Private
router.get('/weekly', getWeeklyAnalytics);

// @route   GET /api/analytics/monthly
// @desc    Get monthly statistics (last 30 days)
// @access  Private
router.get('/monthly', getMonthlyAnalytics);

// @route   GET /api/analytics/streaks
// @desc    Get all habit streaks
// @access  Private
router.get('/streaks', getStreaks);

// @route   GET /api/analytics/completion-rate
// @desc    Get overall completion rate
// @query   days - Optional: Number of days to analyze (default: 30)
// @access  Private
router.get('/completion-rate', getCompletionRate);

export default router;