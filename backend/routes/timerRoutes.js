import express from 'express';
import {
  startTimer,
  stopTimer,
  pauseTimer,
  getTimerStatus,
} from '../controllers/timerController.js';
import { protect } from '../middlewares/authMiddleware.js';
import rateLimit from 'express-rate-limit';

import {timerLimiter} from "../middlewares/rateLimiter.js";
const router = express.Router();



// Apply protect first
router.use(protect);

// Apply rate limiter to all timer routes
router.use(timerLimiter);

// Start Timer
router.post('/start', startTimer);

// Stop Timer
router.post('/stop', stopTimer);

// Pause Timer
router.post('/pause', pauseTimer);

// Get Timer Status
router.get('/status/:habitId', getTimerStatus);

export default router;
