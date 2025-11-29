// GET /api/habits → habitController.getAllHabits
// GET /api/habits/:id → habitController.getHabitById

import express from 'express';
import {
  getAllHabits,
  getHabitById,
  getHabitsByCategory,
  createHabit,
  updateHabit,
  deleteHabit,
} from '../controllers/habitController.js';

const router = express.Router();

// @route   GET /api/habits
// @desc    Get all pre-defined habits (with optional filters)
// @access  Public
router.get('/', getAllHabits);

// @route   GET /api/habits/category/:category
// @desc    Get habits by category
// @access  Public
router.get('/category/:category', getHabitsByCategory);

// @route   GET /api/habits/:id
// @desc    Get single habit by ID
// @access  Public
router.get('/:id', getHabitById);

// Protected routes (require authentication)
// @route   POST /api/habits
// @desc    Create a new habit
// @access  Private
router.post('/', createHabit);

// @route   PUT /api/habits/:id
// @desc    Update a habit
// @access  Private
router.put('/:id', updateHabit);

// @route   DELETE /api/habits/:id
// @desc    Delete a habit
// @access  Private
router.delete('/:id', deleteHabit);

export default router;