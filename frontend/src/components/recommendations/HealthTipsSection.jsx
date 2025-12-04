import React from 'react';
import { Heart, CheckCircle } from 'lucide-react';

const HealthTipsSection = () => {
  const tips = [
    "Start with high-priority habits for maximum impact",
    "Track your progress daily to build consistency",
    "Adjust recommendations as your health improves"
  ];

  return (
    <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
        <Heart className="w-6 h-6" />
        Health Tips
      </h3>
      <ul className="space-y-2 text-sm">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HealthTipsSection;