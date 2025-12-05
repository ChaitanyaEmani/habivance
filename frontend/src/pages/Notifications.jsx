import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import NotificationSettings from '../components/notifications/NotificationSettings';

// Import separated components
import NotificationsHeader from '../components/notifications/NotificationsHeader';
import NotificationCard from '../components/notifications/NotificationCard';
import NotificationsEmptyState from '../components/notifications/NotificationsEmptyState';
import NotificationsPagination from '../components/notifications/NotificationsPagination';
import NotificationsInfoNote from '../components/notifications/NotificationsInfoNote';
import Loading from '../components/common/Loading';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch all notifications
  const fetchNotifications = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/notifications?page=${pageNum}&limit=20`, {
        headers: getAuthHeaders()
      });

      if (response.data.success) {
        setNotifications(response.data.data.notifications);
        setUnreadCount(response.data.data.unreadCount);
        setTotalPages(response.data.data.pagination.pages);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error(error.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark single notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/notifications/${notificationId}/read`,
        {},
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        setNotifications(prev =>
          prev.map(notif =>
            notif._id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/api/notifications/mark-all-read`,
        {},
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
        setUnreadCount(0);
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  // Delete single notification
  const deleteNotification = async (notificationId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/notifications/${notificationId}`,
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
        toast.success('Notification deleted');
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  // Delete all read notifications
  const deleteAllRead = async () => {
    if (!window.confirm('Delete all read notifications?')) return;

    try {
      const response = await axios.delete(
        `${API_URL}/api/notifications/read-all`,
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        setNotifications(prev => prev.filter(notif => !notif.isRead));
        toast.success('All read notifications deleted');
      }
    } catch (error) {
      console.error('Failed to delete read notifications:', error);
      toast.error('Failed to delete read notifications');
    }
  };

  const handleToggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handlePageChange = (newPage) => {
    fetchNotifications(newPage);
  };

  const hasReadNotifications = notifications.some(n => n.isRead);

  if (loading) {
    return <Loading text="notifications" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <NotificationsHeader
          unreadCount={unreadCount}
          showSettings={showSettings}
          onToggleSettings={handleToggleSettings}
          onMarkAllRead={markAllAsRead}
          onDeleteAllRead={deleteAllRead}
          hasReadNotifications={hasReadNotifications}
        />

        {/* Notification Settings */}
        {showSettings && (
          <div className="mb-6">
            <NotificationSettings />
          </div>
        )}

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <NotificationsEmptyState />
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <NotificationsPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Info Note */}
        <NotificationsInfoNote />
      </div>
    </div>
  );
};

export default Notifications;