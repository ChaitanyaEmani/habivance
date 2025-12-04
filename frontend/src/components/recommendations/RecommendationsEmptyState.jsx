import React from 'react';
import { Activity } from 'lucide-react';

const RecommendationsEmptyState = ({ onRefresh }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
      <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-700 mb-2">No recommendations available</h3>
      <p className="text-gray-500 mb-6">Complete your profile to get personalized recommendations</p>
      <button
        onClick={onRefresh}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Refresh Recommendations
      </button>
    </div>
  );
};

export default RecommendationsEmptyState;