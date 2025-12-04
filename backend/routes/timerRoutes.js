
import express from 'express';
import {
  startTimer,
  stopTimer,
  pauseTimer,
  getTimerStatus,
} from '../controllers/timerController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

// @route   POST /api/timer/start
// @desc    Start timer for a habit
// @body    habitId - Required
router.post('/start', startTimer);

// @route   POST /api/timer/stop
// @desc    Stop timer and mark habit as completed
// @body    habitId - Required
router.post('/stop', stopTimer);

// @route   POST /api/timer/pause
// @desc    Pause timer for a habit
// @body    habitId - Required
router.post('/pause', pauseTimer);

// @route   GET /api/timer/status/:habitId
// @desc    Get timer status for a habit
router.get('/status/:habitId', getTimerStatus);

export default router;