import React from "react";
import { Sparkles } from "lucide-react";

const RecommendationEmptyState = ({ onClearFilters }) => {
  return (
    <div className="text-center py-12">
      <div className="inline-block p-8 bg-white rounded-2xl shadow-lg">
        <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No recommendations found</h3>
        <p className="text-gray-500 mb-4">Try adjusting your filters or search query</p>
        <button
          onClick={onClearFilters}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default RecommendationEmptyState;