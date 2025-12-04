import React from 'react';
import { AlertCircle } from 'lucide-react';

const HealthIssuesCard = ({ healthIssues }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Health Conditions</h2>
        <AlertCircle className="w-6 h-6 text-red-500" />
      </div>
      <div className="mt-4">
        {healthIssues && healthIssues.length > 0 ? (
          <div className="space-y-2">
            {healthIssues.map((issue, index) => (
              <div key={index} className="flex items-center space-x-3 bg-red-50 p-4 rounded-lg">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-800 font-medium capitalize">{issue}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No health issues reported</p>
        )}
      </div>
    </div>
  );
};

export default HealthIssuesCard;