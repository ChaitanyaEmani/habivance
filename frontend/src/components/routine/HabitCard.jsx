import React, { useState } from "react";
import { CheckCircle2, Circle, Target, Clock, TrendingUp, Award, Trash2 } from "lucide-react";
import Modal from "../common/Modal";
import Timer from "../Timer";

const HabitCard = ({ habit, isCompleted, onComplete, onDelete }) => {
  const [timer, setTimer] = useState(false);

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-green-100 text-green-700 border-green-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      high: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[priority?.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getCategoryIcon = (category) => {
    return <Target className="w-4 h-4" />;
  };

  const handleTimerComplete = (data) => {
    setTimer(false);
    onComplete(habit._id);
  };

  return (
    <>
      <div
        className={`bg-white border shadow-md rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group ${
          isCompleted ? "border-green-200 bg-green-50/30" : "border-gray-100"
        }`}
      >
        {/* Status Badge */}
        {isCompleted && (
          <div className="flex items-center gap-2 mb-3 bg-green-100 border border-green-200 rounded-lg px-3 py-1.5 w-fit">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-xs font-semibold text-green-700">Completed Today</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2
              className={`text-xl font-bold mb-2 capitalize group-hover:text-indigo-600 transition-colors ${
                isCompleted ? "text-gray-600" : "text-gray-900"
              }`}
            >
              {habit.habit}
            </h2>
            {habit.description && (
              <p className="text-sm text-gray-600 leading-relaxed">{habit.description}</p>
            )}
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2 mb-4">
          {habit.category && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-100">
              {getCategoryIcon(habit.category)}
              {habit.category}
            </span>
          )}
          {habit.priority && (
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border ${getPriorityColor(
                habit.priority
              )}`}
            >
              {habit.priority.charAt(0).toUpperCase() + habit.priority.slice(1)}
            </span>
          )}
        </div>

        {/* Duration */}
        {habit.duration && (
          <div className="flex items-center gap-2 text-gray-700 mb-4 bg-gray-50 rounded-lg px-3 py-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">{habit.duration} minutes</span>
          </div>
        )}

        {/* Streaks */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Current Streak</p>
                <p className="text-lg font-bold text-gray-900">{habit.streak || 0}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Best Streak</p>
                <p className="text-lg font-bold text-gray-900">{habit.longestStreak || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex mt-4 gap-2">
          <button
            type="button"
            onClick={() => {
              if (!isCompleted) {
                setTimer(true);
              }
            }}
            disabled={isCompleted}
            className={`flex-1 p-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              isCompleted
                ? "bg-green-100 text-green-700 cursor-not-allowed border border-green-200"
                : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md hover:shadow-lg"
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </>
            ) : (
              <>
                <Circle className="w-4 h-4" />
                Make Complete
              </>
            )}
          </button>
          <button
            onClick={() => onDelete(habit._id)}
            className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 active:scale-95 transition-all border border-red-200"
            title="Delete habit"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Timer Modal - Rendered outside the card */}
      {timer && (
        <Modal isOpen={timer} onClose={() => setTimer(false)} title="Start Exercise">
          <Timer habitId={habit._id} onComplete={handleTimerComplete} />
        </Modal>
      )}
    </>
  );
};

export default HabitCard;