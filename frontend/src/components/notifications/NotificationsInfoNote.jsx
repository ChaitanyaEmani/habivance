import React from 'react';
import { Info } from 'lucide-react';

const NotificationsInfoNote = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
      <p className="text-sm text-blue-800 flex items-start gap-2">
        <Info size={18} className="flex-shrink-0 mt-0.5" />
        <span>
          <strong>Note:</strong> Read notifications are automatically deleted after 24 hours to keep your inbox clean.
        </span>
      </p>
    </div>
  );
};

export default NotificationsInfoNote;