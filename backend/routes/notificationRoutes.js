// GET /api/notifications → notificationController.getAll
// POST /api/notifications → notificationController.create
// PUT /api/notifications/:id/read → notificationController.markAsRead

import express from 'express';
import {
  getAll,
  getUnread,
  create,
  markAsRead,
  markAllRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// @route   GET /api/notifications
// @desc    Get all notifications for user
// @query   isRead - Optional: Filter by read status (true/false)
// @query   type - Optional: Filter by notification type
// @access  Private
router.get('/', getAll);

// @route   GET /api/notifications/unread
// @desc    Get unread notifications
// @access  Private
router.get('/unread', getUnread);

// @route   POST /api/notifications
// @desc    Create a new notification/reminder
// @access  Private
router.post('/', create);

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', markAllRead);

// @route   PUT /api/notifications/:id/read
// @desc    Mark a notification as read
// @access  Private
router.put('/:id/read', markAsRead);

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete('/:id', deleteNotification);

export default router;