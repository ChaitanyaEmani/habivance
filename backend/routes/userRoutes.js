// GET /api/users/profile → userController.getProfile
// PUT /api/users/profile → userController.updateProfile

import express from 'express';
import {
  getProfile,
  updateProfile,
  deleteProfile
} from '../controllers/userController.js';
import { validateProfile } from '../middlewares/validationMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', getProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', validateProfile, updateProfile);

// @route   DELETE /api/users/profile
// @desc    Delete user account
// @access  Private
router.delete('/profile', deleteProfile);

// @route   GET /api/users/profile-image
// @desc    Get user profile image
// @access  Private
// router.get('/profile-image', getProfileImage);

export default router;