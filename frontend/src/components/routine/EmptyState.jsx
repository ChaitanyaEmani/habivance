import React from "react";
import { Search } from "lucide-react";

const EmptyState = ({ hasActiveFilters, onClearFilters }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-500 text-lg font-medium">No habits found</p>
      <p className="text-gray-400 text-sm mt-2">
        {hasActiveFilters
          ? "Try adjusting your filters"
          : "Click 'Add Habit' to create your first routine"}
      </p>
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;