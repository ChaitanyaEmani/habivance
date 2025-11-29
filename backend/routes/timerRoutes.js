// POST /api/timer/start → timerController.startTimer
// POST /api/timer/stop → timerController.stopTimer

import express from 'express';
import {
  startTimer,
  stopTimer,
  pauseTimer,
  getTimerStatus,
} from '../controllers/timerController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// @route   POST /api/timer/start
// @desc    Start timer for a habit
// @body    dailyHabitId - Required
// @access  Private
router.post('/start', startTimer);

// @route   POST /api/timer/stop
// @desc    Stop timer for a habit
// @body    dailyHabitId - Required
// @access  Private
router.post('/stop', stopTimer);

// @route   POST /api/timer/pause
// @desc    Pause timer for a habit
// @body    dailyHabitId - Required
// @access  Private
router.post('/pause', pauseTimer);

// @route   GET /api/timer/status/:dailyHabitId
// @desc    Get timer status for a habit
// @access  Private
router.get('/status/:dailyHabitId', getTimerStatus);

export default router;