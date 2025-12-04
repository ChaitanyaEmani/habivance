import React from 'react';
import { 
  Activity, 
  Heart, 
  Coffee, 
  Moon, 
  Droplets, 
  TrendingUp, 
  CheckCircle 
} from 'lucide-react';

const RecommendationCard = ({ recommendation, onAddToRoutine }) => {
  // Generate a consistent color based on category name
  const getCategoryColor = (category) => {
    if (!category) return 'bg-gray-100 text-gray-700 border-gray-300';
    
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      'bg-blue-100 text-blue-700 border-blue-300',
      'bg-purple-100 text-purple-700 border-purple-300',
      'bg-green-100 text-green-700 border-green-300',
      'bg-orange-100 text-orange-700 border-orange-300',
      'bg-red-100 text-red-700 border-red-300',
      'bg-pink-100 text-pink-700 border-pink-300',
      'bg-indigo-100 text-indigo-700 border-indigo-300',
      'bg-teal-100 text-teal-700 border-teal-300',
      'bg-cyan-100 text-cyan-700 border-cyan-300',
      'bg-emerald-100 text-emerald-700 border-emerald-300',
      'bg-lime-100 text-lime-700 border-lime-300',
      'bg-amber-100 text-amber-700 border-amber-300',
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Generate a consistent icon based on category name
  const getCategoryIcon = (category) => {
    if (!category) return <Activity className="w-5 h-5" />;
    
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('hydra') || categoryLower.includes('water')) {
      return <Droplets className="w-5 h-5" />;
    }
    if (categoryLower.includes('sleep') || categoryLower.includes('rest')) {
      return <Moon className="w-5 h-5" />;
    }
    if (categoryLower.includes('exercise') || categoryLower.includes('fitness') || categoryLower.includes('workout')) {
      return <Activity className="w-5 h-5" />;
    }
    if (categoryLower.includes('nutrition') || categoryLower.includes('food') || categoryLower.includes('diet') || categoryLower.includes('meal')) {
      return <Coffee className="w-5 h-5" />;
    }
    if (categoryLower.includes('health') || categoryLower.includes('medical') || categoryLower.includes('wellness')) {
      return <Heart className="w-5 h-5" />;
    }
    
    return <TrendingUp className="w-5 h-5" />;
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      'high': 'bg-red-500 text-white',
      'medium': 'bg-yellow-500 text-white',
      'low': 'bg-green-500 text-white'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[priority] || styles.low}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Card Header */}
      <div className={`p-4 ${getCategoryColor(recommendation.category)} border-b-2`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getCategoryIcon(recommendation.category)}
            <span className="font-bold text-sm uppercase tracking-wide">
              {recommendation.category}
            </span>
          </div>
          {getPriorityBadge(recommendation.priority)}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {recommendation.name}
        </h3>
        
        {recommendation.description && (
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {recommendation.description}
          </p>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="capitalize">{recommendation.frequency}</span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 pb-6">
        <button 
          onClick={() => onAddToRoutine(recommendation)} 
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-800 transition-all duration-300 font-semibold"
        >
          Add to Routine
        </button>
      </div>
    </div>
  );
};

export default RecommendationCard;