import React from 'react';

const ProfileEmptyState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-gray-600 text-xl">No profile data available</div>
    </div>
  );
};

export default ProfileEmptyState;