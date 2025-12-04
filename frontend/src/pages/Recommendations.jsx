import React, { useState, useEffect } from 'react';
import { Heart, Brain, Utensils, Activity, Clock, TrendingUp, Sparkles, Search, Filter } from 'lucide-react';
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_BASE_URL;
   
const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
       const token = localStorage.getItem("token");
  // Simulated API call - replace with your actual API call
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/recommendations/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRecommendations(res.data.data.recommendations);
        setLoading(false);
        
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const getCategoryIcon = (category) => {
    const icons = {
      'diet': <Utensils className="w-5 h-5" />,
      'mental health': <Brain className="w-5 h-5" />,
      'fitness': <Activity className="w-5 h-5" />,
      'health': <Heart className="w-5 h-5" />,
    };
    return icons[category?.toLowerCase()] || <Sparkles className="w-5 h-5" />;
  };

  const getCategoryColor = (category) => {
    // Generate consistent color for each category based on hash
    const categoryLower = category?.toLowerCase() || '';
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500',
      'bg-orange-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
      'bg-yellow-500', 'bg-cyan-500', 'bg-rose-500', 'bg-violet-500'
    ];
    
    // Simple hash function for consistent color assignment
    let hash = 0;
    for (let i = 0; i < categoryLower.length; i++) {
      hash = categoryLower.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.2) return 'High';
    if (confidence >= 0.15) return 'Medium';
    return 'Low';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'bg-red-100 text-red-700 border-red-300',
      'medium': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'low': 'bg-green-100 text-green-700 border-green-300'
    };
    return colors[priority?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getPriorityBadgeColor = (priority) => {
    const colors = {
      'high': 'bg-red-500',
      'medium': 'bg-yellow-500',
      'low': 'bg-green-500'
    };
    return colors[priority?.toLowerCase()] || 'bg-gray-500';
  };

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesSearch = rec.habit?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rec.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rec.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || rec.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesPriority = selectedPriority === 'all' || rec.priority?.toLowerCase() === selectedPriority.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const categories = [...new Set(recommendations.map(r => r.category).filter(Boolean))];
  const priorities = ['high', 'medium', 'low'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-indigo-600 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Your Health Recommendations</h1>
              <p className="text-gray-600 mt-1">Personalized habits to improve your wellbeing</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Habits</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{recommendations.length}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-indigo-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Avg. Duration</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {Math.round(recommendations.reduce((acc, r) => acc + (r.duration || 0), 0) / recommendations.length)} min
                </p>
              </div>
              <Clock className="w-10 h-10 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Categories</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{categories.length - 1}</p>
              </div>
              <Activity className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
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
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
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
                  {categories.map((cat) => (
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
          {(searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all') && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600 font-medium">Active filters:</span>
              {searchQuery && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  Search: "{searchQuery}"
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Category: {selectedCategory}
                </span>
              )}
              {selectedPriority !== 'all' && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(selectedPriority)}`}>
                  Priority: {selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1)}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedPriority('all');
                }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-800">{filteredRecommendations.length}</span> of{' '}
            <span className="font-semibold text-gray-800">{recommendations.length}</span> recommendations
          </p>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((rec, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              {/* Card Header */}
              <div className={`${getCategoryColor(rec.category)} p-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3 text-white">
                  {getCategoryIcon(rec.category)}
                  <span className="font-semibold">{rec.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  {rec.priority && (
                    <span className={`${getPriorityBadgeColor(rec.priority)} px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wide`}>
                      {rec.priority}
                    </span>
                  )}
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
                    {getConfidenceLabel(rec.confidence)}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{rec.habit}</h3>
                
                {rec.description && (
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{rec.description}</p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{rec.duration} min/day</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Confidence</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full ${getCategoryColor(rec.category)}`}
                          style={{ width: `${(rec.confidence || 0) * 500}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold text-gray-700">
                        {Math.round((rec.confidence || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRecommendations.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block p-6 bg-white rounded-2xl shadow-lg">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No recommendations found</h3>
              <p className="text-gray-500">Try selecting a different category</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;