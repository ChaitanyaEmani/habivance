// controllers/notificationController.js
import notificationService from '../services/notificationService.js';

// Get all notifications
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await notificationService.getAll(userId, page, limit);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user._id);
    res.status(200).json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(
      req.params.notificationId,
      req.user._id
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark all as read
export const markAllAsRead = async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user._id);
    res.status(200).json({ success: true, message: 'All marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const result = await notificationService.delete(
      req.params.notificationId,
      req.user._id
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete all read notifications
export const deleteAllRead = async (req, res) => {
  try {
    await notificationService.deleteAllRead(req.user._id);
    res.status(200).json({ success: true, message: 'All read notifications deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};