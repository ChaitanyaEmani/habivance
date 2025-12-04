import React from 'react';
import { Bell } from 'lucide-react';

const NotificationsEmptyState = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
      <Bell className="mx-auto text-gray-300 mb-4" size={64} />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No notifications yet</h3>
      <p className="text-gray-500">When you get notifications, they'll show up here</p>
    </div>
  );
};

export default NotificationsEmptyState;