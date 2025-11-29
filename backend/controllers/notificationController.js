// Purpose: Manage alerts and reminders
// Routes: GET /notifications, POST /notifications, PUT /notifications/:id/read, DELETE /notifications/:id
// Actions: Create/update/delete habit alerts

import * as notificationService from '../services/notificationService.js';

export const getAll = async (req, res) => {
  try {
    const { isRead, type } = req.query;
    const filters = {};
    
    if (isRead !== undefined) {
      filters.isRead = isRead === 'true';
    }
    if (type) {
      filters.type = type;
    }

    const notifications = await notificationService.getAllNotifications(req.user._id, filters);
    res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve notifications',
    });
  }
};

export const getUnread = async (req, res) => {
  try {
    const notifications = await notificationService.getUnreadNotifications(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Unread notifications retrieved successfully',
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve unread notifications',
    });
  }
};

export const create = async (req, res) => {
  try {
    const { habitId, dailyHabitId, alertTime, message, type } = req.body;
    
    const notification = await notificationService.createReminder(
      req.user._id,
      habitId,
      dailyHabitId,
      alertTime,
      message,
      type
    );

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create notification',
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      message: 'Notification marked as read successfully',
      data: notification,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to mark notification as read',
    });
  }
};

export const markAllRead = async (req, res) => {
  try {
    const result = await notificationService.markAllAsRead(req.user._id);
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark all notifications as read',
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const result = await notificationService.deleteNotification(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete notification',
    });
  }
};