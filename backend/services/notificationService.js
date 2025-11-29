// Purpose: Alert scheduling and management
// Functions: createReminder(), scheduleAlert(), sendNotification()
// Logic: Create alerts based on habit scheduled time, trigger browser notifications

import Notification from '../models/Notification.js';
import DailyHabit from '../models/DailyHabit.js';
import User from '../models/User.js';
import { sendReminderEmail } from '../utils/emailService.js';

export const createReminder = async (userId, habitId, dailyHabitId, alertTime, message, type) => {
  try {
    const notification = await Notification.create({
      userId,
      habitId,
      dailyHabitId,
      alertTime: new Date(alertTime),
      message,
      type: type || 'reminder',
    });

    return notification;
  } catch (error) {
    console.error('Error in createReminder:', error);
    throw new Error(error.message || 'Failed to create reminder');
  }
};

export const scheduleAlert = async (dailyHabitId) => {
  try {
    const dailyHabit = await DailyHabit.findById(dailyHabitId).populate('habitId');

    if (!dailyHabit || !dailyHabit.scheduledTime) {
      return null;
    }

    // Parse scheduled time (format: "HH:MM")
    const [hours, minutes] = dailyHabit.scheduledTime.split(':').map(Number);
    
    // Create alert time (15 minutes before scheduled time)
    const alertTime = new Date(dailyHabit.date);
    alertTime.setHours(hours, minutes - 15, 0, 0);

    // Only create alert if it's in the future
    if (alertTime > new Date()) {
      const message = `Time to ${dailyHabit.habitId.habitName}! Scheduled at ${dailyHabit.scheduledTime}`;
      
      const notification = await createReminder(
        dailyHabit.userId,
        dailyHabit.habitId._id,
        dailyHabit._id,
        alertTime,
        message,
        'reminder'
      );

      return notification;
    }

    return null;
  } catch (error) {
    console.error('Error in scheduleAlert:', error);
    throw new Error(error.message || 'Failed to schedule alert');
  }
};

export const sendNotification = async (notificationId) => {
  try {
    const notification = await Notification.findById(notificationId)
      .populate('userId')
      .populate('habitId');

    if (!notification || notification.isSent) {
      return null;
    }

    // Send email notification
    if (notification.userId.email) {
      await sendReminderEmail(
        notification.userId.email,
        notification.habitId.habitName,
        notification.message
      );
    }

    // Mark as sent
    notification.isSent = true;
    await notification.save();

    return notification;
  } catch (error) {
    console.error('Error in sendNotification:', error);
    throw new Error(error.message || 'Failed to send notification');
  }
};

export const getAllNotifications = async (userId, filters = {}) => {
  try {
    const query = { userId };

    if (filters.isRead !== undefined) {
      query.isRead = filters.isRead;
    }

    if (filters.type) {
      query.type = filters.type;
    }

    const notifications = await Notification.find(query)
      .populate('habitId')
      .sort({ alertTime: -1 });

    return notifications;
  } catch (error) {
    console.error('Error in getAllNotifications:', error);
    throw new Error(error.message || 'Failed to retrieve notifications');
  }
};

export const getUnreadNotifications = async (userId) => {
  try {
    return await getAllNotifications(userId, { isRead: false });
  } catch (error) {
    console.error('Error in getUnreadNotifications:', error);
    throw new Error(error.message || 'Failed to retrieve unread notifications');
  }
};

export const markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOne({
      _id: notificationId,
      userId,
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.isRead = true;
    await notification.save();

    return notification;
  } catch (error) {
    console.error('Error in markAsRead:', error);
    throw new Error(error.message || 'Failed to mark notification as read');
  }
};

export const markAllAsRead = async (userId) => {
  try {
    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    return { message: 'All notifications marked as read' };
  } catch (error) {
    console.error('Error in markAllAsRead:', error);
    throw new Error(error.message || 'Failed to mark all notifications as read');
  }
};

export const deleteNotification = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOne({
      _id: notificationId,
      userId,
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    await notification.deleteOne();
    return { message: 'Notification deleted' };
  } catch (error) {
    console.error('Error in deleteNotification:', error);
    throw new Error(error.message || 'Failed to delete notification');
  }
};

export const processPendingNotifications = async () => {
  try {
    const now = new Date();
    
    // Find notifications that should be sent
    const pendingNotifications = await Notification.find({
      alertTime: { $lte: now },
      isSent: false,
    });

    const results = [];
    for (const notification of pendingNotifications) {
      try {
        const sent = await sendNotification(notification._id);
        results.push({ success: true, notificationId: notification._id });
      } catch (error) {
        console.error(`Failed to send notification ${notification._id}:`, error);
        results.push({ success: false, notificationId: notification._id, error: error.message });
      }
    }

    return results;
  } catch (error) {
    console.error('Error in processPendingNotifications:', error);
    throw new Error(error.message || 'Failed to process pending notifications');
  }
};