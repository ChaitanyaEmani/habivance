// services/notificationService.js
import Notification from '../models/Notification.js';

class NotificationService {
  // Create notification
  async create(userId, title, message, type = 'GENERAL', priority = 'medium') {
    return await Notification.create({ userId, title, message, type, priority });
  }

  // Get user notifications with pagination
  async getAll(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments({ userId }),
      Notification.countDocuments({ userId, isRead: false })
    ]);

    return {
      notifications,
      unreadCount,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    };
  }

  // Get unread count
  async getUnreadCount(userId) {
    return await Notification.countDocuments({ userId, isRead: false });
  }

  // Mark as read
  async markAsRead(notificationId, userId) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );
  }

  // Mark all as read
  async markAllAsRead(userId) {
    return await Notification.updateMany({ userId, isRead: false }, { isRead: true });
  }

  // Delete notification
  async delete(notificationId, userId) {
    return await Notification.findOneAndDelete({ _id: notificationId, userId });
  }

  // Delete all read notifications
  async deleteAllRead(userId) {
    return await Notification.deleteMany({ userId, isRead: true });
  }
}

export default new NotificationService();