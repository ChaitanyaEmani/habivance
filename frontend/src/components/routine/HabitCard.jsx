import React from 'react';
import {
  Flame,
  CheckCircle2,
  Circle,
  Activity,
  Droplets,
  Moon,
  Coffee,
  Heart,
  TrendingUp,
  Clock,
  Calendar,
  Award,
  Trash2,
} from 'lucide-react';

const HabitCard = ({ 
  routine, 
  onComplete, 
  onDelete, 
  onStartExercise 
}) => {
  // Generate icon based on category
  const getCategoryIcon = (category) => {
    if (!category) return <Activity className="w-5 h-5" />;

    const categoryLower = category.toLowerCase();

    if (categoryLower.includes("hydra") || categoryLower.includes("water")) {
      return <Droplets className="w-5 h-5" />;
    }
    if (categoryLower.includes("sleep") || categoryLower.includes("rest")) {
      return <Moon className="w-5 h-5" />;
    }
    if (
      categoryLower.includes("exercise") ||
      categoryLower.includes("fitness") ||
      categoryLower.includes("workout")
    ) {
      return <Activity className="w-5 h-5" />;
    }
    if (
      categoryLower.includes("nutrition") ||
      categoryLower.includes("food") ||
      categoryLower.includes("diet")
    ) {
      return <Coffee className="w-5 h-5" />;
    }
    if (categoryLower.includes("health") || categoryLower.includes("medical")) {
      return <Heart className="w-5 h-5" />;
    }

    return <TrendingUp className="w-5 h-5" />;
  };

  // Generate color based on category
  const getCategoryColor = (category) => {
    if (!category) return "bg-gray-100 text-gray-700 border-gray-300";

    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
      "bg-blue-100 text-blue-700 border-blue-300",
      "bg-purple-100 text-purple-700 border-purple-300",
      "bg-green-100 text-green-700 border-green-300",
      "bg-orange-100 text-orange-700 border-orange-300",
      "bg-red-100 text-red-700 border-red-300",
      "bg-pink-100 text-pink-700 border-pink-300",
      "bg-indigo-100 text-indigo-700 border-indigo-300",
      "bg-teal-100 text-teal-700 border-teal-300",
      "bg-cyan-100 text-cyan-700 border-cyan-300",
      "bg-emerald-100 text-emerald-700 border-emerald-300",
      "bg-lime-100 text-lime-700 border-lime-300",
      "bg-amber-100 text-amber-700 border-amber-300",
    ];

    return colors[Math.abs(hash) % colors.length];
  };

  const handleCompleteClick = () => {
    if (routine.streak > 0) return;

    if (routine.category.toLowerCase().includes("exercise")) {
      onStartExercise(routine._id);
    } else {
      onComplete(routine._id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Card Header */}
      <div
        className={`p-4 ${getCategoryColor(routine.category)} border-b-2`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getCategoryIcon(routine.category)}
            <span className="font-bold text-sm uppercase tracking-wide">
              {routine.category}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {routine.streak > 0 ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {routine.name}
        </h3>

        {routine.description && (
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {routine.description}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-gray-600">Current Streak</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {routine.streak}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-gray-600">Best Streak</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {routine.longestStreak || 0}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="capitalize">{routine.frequency}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              {routine.priority === "high" && "🔴 High Priority"}
              {routine.priority === "medium" && "🟡 Medium Priority"}
              {routine.priority === "low" && "🟢 Low Priority"}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 pb-6 flex gap-2">
        <button
          onClick={handleCompleteClick}
          disabled={routine.streak > 0}
          className={`flex-1 py-2 rounded-lg transition-all duration-300 font-semibold
            ${
              routine.streak > 0
                ? "bg-green-100 text-green-700 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-800"
            }`}
        >
          {routine.streak > 0
            ? "✓ Completed"
            : routine.category.toLowerCase().includes("exercise")
            ? "Start Exercise"
            : "Mark as Completed"}
        </button>
        <button
          onClick={() => onDelete(routine._id)}
          className="px-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default HabitCard;