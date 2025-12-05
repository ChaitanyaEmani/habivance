import React from "react";
import { Search, Filter, X } from "lucide-react";

const RecommendationSearchFilter = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority,
  categories,
  priorities,
  clearAllFilters,
}) => {
  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search habits, descriptions, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="lg:w-64">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none cursor-pointer transition-all bg-white"
            >
              <option value="all">All Categories</option>
              {categories.sort().map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority Filter */}
        <div className="lg:w-48">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none cursor-pointer transition-all bg-white"
          >
            <option value="all">All Priorities</option>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600 font-medium">Active filters:</span>
          {searchQuery && (
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium flex items-center gap-1">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:bg-indigo-200 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-1">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('all')} className="hover:bg-purple-200 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedPriority !== 'all' && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
              selectedPriority === 'high' ? 'bg-red-100 text-red-700' :
              selectedPriority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              Priority: {selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1)}
              <button 
                onClick={() => setSelectedPriority('all')} 
                className={`rounded-full p-0.5 ${
                  selectedPriority === 'high' ? 'hover:bg-red-200' :
                  selectedPriority === 'medium' ? 'hover:bg-yellow-200' :
                  'hover:bg-green-200'
                }`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationSearchFilter;