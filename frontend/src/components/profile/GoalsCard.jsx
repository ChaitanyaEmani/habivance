import React from 'react';
import { Target, TrendingDown } from 'lucide-react';

const GoalsCard = ({ goals }) => {
  return (
    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Your Goal</h2>
        <Target className="w-6 h-6" />
      </div>
      <div className="flex items-center space-x-3 mt-6">
        <TrendingDown className="w-8 h-8" />
        <div>
          <p className="text-3xl font-bold capitalize">{goals}</p>
          <p className="text-green-100 mt-1">Keep pushing towards your target!</p>
        </div>
      </div>
    </div>
  );
};

export default GoalsCard;