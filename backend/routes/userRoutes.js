import express from 'express';
import {
  getProfile,
  updateProfile,
  deleteProfile
} from '../controllers/userController.js';
import { validateProfile } from '../middlewares/validationMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js';
import rateLimit from 'express-rate-limit';
import { getProfileLimiter,updateProfileLimiter,deleteProfileLimiter } from '../middlewares/rateLimiter.js';
const router = express.Router();

// 🔐 Protect all routes
router.use(protect);



// GET user profile
router.get('/profile', getProfileLimiter, getProfile);

// UPDATE user profile
router.put('/profile', updateProfileLimiter, validateProfile, updateProfile);

// DELETE user profile
router.delete('/profile', deleteProfileLimiter, deleteProfile);

export default router;
