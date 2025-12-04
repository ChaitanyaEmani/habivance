import React from 'react';
import { Bell, CheckCheck, Trash2, Settings } from 'lucide-react';

const NotificationsHeader = ({ 
  unreadCount, 
  showSettings,
  onToggleSettings,
  onMarkAllRead, 
  onDeleteAllRead,
  hasReadNotifications 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Bell className="text-blue-600" size={32} />
            Notifications
          </h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` 
              : 'All caught up!'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onToggleSettings}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm font-medium"
          >
            <Settings size={18} />
            Settings
          </button>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm font-medium"
            >
              <CheckCheck size={18} />
              Mark All Read
            </button>
          )}
          {hasReadNotifications && (
            <button
              onClick={onDeleteAllRead}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm font-medium"
            >
              <Trash2 size={18} />
              Delete Read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsHeader;