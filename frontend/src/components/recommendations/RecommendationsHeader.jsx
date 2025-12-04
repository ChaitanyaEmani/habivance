import React from 'react';
import { RefreshCw } from 'lucide-react';

const RecommendationsHeader = ({ profile, mlStatus, onRefresh }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Your Personalized Health Recommendations
          </h1>
          <p className="text-gray-600">
            Based on your health profile and goals
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="bg-indigo-100 text-indigo-700 p-3 rounded-lg hover:bg-indigo-200 transition-colors"
          title="Refresh recommendations"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Summary */}
      {profile && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 font-semibold mb-1">BMI</p>
            <p className="text-2xl font-bold text-blue-800">{profile.bmi}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-600 font-semibold mb-1">Category</p>
            <p className="text-2xl font-bold text-purple-800">{profile.bmiCategory}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 font-semibold mb-1">Age</p>
            <p className="text-2xl font-bold text-green-800">{profile.age} years</p>
          </div>
        </div>
      )}

      {/* ML Status */}
      <div className="mt-4 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${mlStatus === 'online' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
        <span className="text-sm text-gray-600">
          AI Model: <span className="font-semibold">{mlStatus === 'online' ? 'Active' : 'Using Fallback'}</span>
        </span>
      </div>
    </div>
  );
};

export default RecommendationsHeader;