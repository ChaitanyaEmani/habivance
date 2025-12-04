import React from 'react';
import { Activity } from 'lucide-react';

const BMICard = ({ bmi, category, height, weight }) => {
  const getBMIColor = (category) => {
    const colors = {
      'Underweight': 'text-blue-600 bg-blue-50',
      'Normal': 'text-green-600 bg-green-50',
      'Overweight': 'text-orange-600 bg-orange-50',
      'Obese': 'text-red-600 bg-red-50'
    };
    return colors[category] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">BMI Status</h2>
        <Activity className="w-6 h-6 text-indigo-600" />
      </div>
      <div className="text-center py-6">
        <div className="text-5xl font-bold text-indigo-600 mb-2">{bmi}</div>
        <div className={`inline-block px-4 py-2 rounded-full font-semibold ${getBMIColor(category)}`}>
          {category}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
        <div>
          <p className="text-gray-500 text-sm">Height</p>
          <p className="text-2xl font-semibold text-gray-800">{height} cm</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Weight</p>
          <p className="text-2xl font-semibold text-gray-800">{weight} kg</p>
        </div>
      </div>
    </div>
  );
};

export default BMICard;