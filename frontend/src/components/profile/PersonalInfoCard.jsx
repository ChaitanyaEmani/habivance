import React from 'react';
import { User } from 'lucide-react';

const PersonalInfoCard = ({ age, height, weight }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Personal Info</h2>
        <User className="w-6 h-6 text-indigo-600" />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b">
          <span className="text-gray-600">Age</span>
          <span className="text-xl font-semibold text-gray-800">{age} years</span>
        </div>
        <div className="flex items-center justify-between py-3 border-b">
          <span className="text-gray-600">Height</span>
          <span className="text-xl font-semibold text-gray-800">{height} cm</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-gray-600">Weight</span>
          <span className="text-xl font-semibold text-gray-800">{weight} kg</span>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoCard;