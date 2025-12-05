// routes/notificationRoutes.js
import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead
} from '../controllers/notificationController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { getNotificationsLimiter,unreadCountLimiter,markAllReadLimiter,markAsReadLimiter,deleteAllReadLimiter,deleteNotificationLimiter } from '../middlewares/rateLimiter.js';
const router = express.Router();

// 🔐 All routes protected
router.use(protect);

// --- Routes ---

router.get('/', getNotificationsLimiter, getNotifications);
router.get('/unread-count', unreadCountLimiter, getUnreadCount);
router.put('/mark-all-read', markAllReadLimiter, markAllAsRead);
router.put('/:notificationId/read', markAsReadLimiter, markAsRead);
router.delete('/read-all', deleteAllReadLimiter, deleteAllRead);
router.delete('/:notificationId', deleteNotificationLimiter, deleteNotification);

export default router;
