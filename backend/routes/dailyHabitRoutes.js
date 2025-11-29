// POST /api/daily-habits → dailyHabitController.addHabit
// GET /api/daily-habits → dailyHabitController.getTodayHabits
// PUT /api/daily-habits/:id → dailyHabitController.updateHabit
// DELETE /api/daily-habits/:id → dailyHabitController.removeHabit

import express from 'express';
import {
  addHabit,
  getTodayHabits,
  getHabitsByDateRange,
  updateHabit,
  removeHabit,
  getHabitById,
} from '../controllers/dailyHabitController.js';
import { validateDailyHabit } from '../middlewares/validationMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// @route   POST /api/daily-habits
// @desc    Add a habit to daily plan
// @access  Private
router.post('/', validateDailyHabit, addHabit);

// @route   GET /api/daily-habits
// @desc    Get today's habits (or habits for specific date)
// @query   date - Optional: Specific date in ISO format
// @access  Private
router.get('/', getTodayHabits);

// @route   GET /api/daily-habits/range
// @desc    Get habits within a date range
// @query   startDate, endDate - Required: Date range in ISO format
// @access  Private
router.get('/range', getHabitsByDateRange);

// @route   GET /api/daily-habits/:id
// @desc    Get a specific daily habit by ID
// @access  Private
router.get('/:id', getHabitById);

// @route   PUT /api/daily-habits/:id
// @desc    Update a daily habit
// @access  Private
router.put('/:id', updateHabit);

// @route   DELETE /api/daily-habits/:id
// @desc    Remove a habit from daily plan
// @access  Private
router.delete('/:id', removeHabit);

export default router;