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

// All routes are protected
router.use(protect);

// @route   GET /api/analytics/daily
// @desc    Get daily statistics
// @query   date - Optional: Specific date in ISO format
router.get('/daily', getDailyAnalytics);

// @route   GET /api/analytics/weekly
// @desc    Get weekly statistics (last 7 days)
router.get('/weekly', getWeeklyAnalytics);

// @route   GET /api/analytics/monthly
// @desc    Get monthly statistics (last 30 days)
router.get('/monthly', getMonthlyAnalytics);

// @route   GET /api/analytics/streaks
// @desc    Get all habit streaks
router.get('/streaks', getStreaks);

// @route   GET /api/analytics/completion-rate
// @desc    Get overall completion rate
// @query   days - Optional: Number of days (default: 30)
router.get('/completion-rate', getCompletionRate);

export default router;