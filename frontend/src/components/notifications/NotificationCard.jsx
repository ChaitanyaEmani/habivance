import React from 'react';
import { Bell, Check, X, AlertCircle, Info } from 'lucide-react';

const NotificationCard = ({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}) => {
  // Get icon based on notification type
  const getNotificationIcon = (type, priority) => {
    const iconProps = { size: 20, className: 'flex-shrink-0' };
    
    if (priority === 'high') {
      return <AlertCircle {...iconProps} className="text-red-500 flex-shrink-0" />;
    }
    
    switch (type) {
      case 'PROFILE_UPDATED':
      case 'SECURITY_UPDATE':
        return <Info {...iconProps} className="text-blue-500 flex-shrink-0" />;
      case 'BMI_CALCULATED':
        return <Info {...iconProps} className="text-green-500 flex-shrink-0" />;
      case 'ACCOUNT_DELETED':
        return <AlertCircle {...iconProps} className="text-red-500 flex-shrink-0" />;
      default:
        return <Bell {...iconProps} className="text-gray-500 flex-shrink-0" />;
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Format time ago
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    return new Date(date).toLocaleDateString();
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-5 ${
        !notification.isRead ? 'border-l-4 border-blue-600' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="mt-1">
          {getNotificationIcon(notification.type, notification.priority)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className={`text-lg font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
              {notification.title}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(notification.priority)}`}>
              {notification.priority}
            </span>
          </div>

          <p className={`text-sm mb-3 ${!notification.isRead ? 'text-gray-700' : 'text-gray-500'}`}>
            {notification.message}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-xs text-gray-500">
              {getTimeAgo(notification.createdAt)}
            </span>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!notification.isRead && (
                <button
                  onClick={() => onMarkAsRead(notification._id)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  <Check size={16} />
                  Mark Read
                </button>
              )}
              <button
                onClick={() => onDelete(notification._id)}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
              >
                <X size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;