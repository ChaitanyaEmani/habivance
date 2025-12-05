import React from "react";
import { Clock } from "lucide-react";

const RecommendationCard = ({ recommendation, onAddToRoutine }) => {
  const getPriorityCardColor = (priority) => {
    const colors = {
      'high': 'bg-gradient-to-r from-red-500 to-red-600',
      'medium': 'bg-gradient-to-r from-yellow-500 to-orange-500',
      'low': 'bg-gradient-to-r from-green-500 to-green-600'
    };
    return colors[priority?.toLowerCase()] || 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-105">
      {/* Card Header */}
      <div className={`${getPriorityCardColor(recommendation.priority)} p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3 text-white">
          <span className="font-semibold text-sm">{recommendation.category}</span>
        </div>
        <div className="flex items-center gap-2">
          {recommendation.priority && (
            <span className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wide">
              {recommendation.priority}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
          {recommendation.habit}
        </h3>
        
        {recommendation.description && (
          <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
            {recommendation.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{recommendation.duration} min/day</span>
          </div>
        </div>
        
        <button 
          onClick={() => onAddToRoutine(recommendation)} 
          className="bg-blue-500 hover:bg-blue-600 p-2 text-white w-full mt-2 rounded-md transition-colors font-medium"
        >
          Add to Routine
        </button>
      </div>
    </div>
  );
};

export default RecommendationCard;