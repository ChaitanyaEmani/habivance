import React from 'react';
import { Activity, Plus } from 'lucide-react';

const EmptyState = ({ 
  searchTerm, 
  categoryFilter, 
  filter, 
  onAddClick 
}) => {
  const hasFilters = searchTerm || categoryFilter !== "all" || filter !== "all";

  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
      <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-700 mb-2">
        No habits found
      </h3>
      <p className="text-gray-500 mb-6">
        {hasFilters
          ? "Try adjusting your filters"
          : "Start building healthy habits today"}
      </p>
      <button 
        onClick={onAddClick} 
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
      >
        <Plus className="w-5 h-5" />
        Add New Habit
      </button>
    </div>
  );
};

export default EmptyState;