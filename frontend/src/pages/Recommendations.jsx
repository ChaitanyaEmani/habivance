import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Sparkles, Filter } from 'lucide-react';
import axios from 'axios';
import RecommendationSearchFilter from '../components/recommendations/RecommendationSearchFilter';
import RecommendationCard from '../components/recommendations/RecommendationCard';
import RecommendationEmptyState from '../components/recommendations/RecommendationEmptyState';
import StatCard from '../components/common/StatCard';
import Loading from '../components/common/Loading';
import PageHeader from '../components/common/PageHeader';
import {toast} from 'react-toastify';
const API_URL = import.meta.env.VITE_API_BASE_URL;

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`${API_URL}api/recommendations/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(res.data.data.recommendations);
        setRecommendations(res.data.data.recommendations);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const addRoutine = async (rec) => {
    try {
      const res = await axios.post(`${API_URL}api/habits/add`, rec, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(res.data);
      toast.success(res.data.message);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to add habit";
            toast.error(errorMsg);
            console.error(error);
    }
  };

  // Filter recommendations
  const filteredRecommendations = recommendations.filter(rec => {
    const matchesSearch = rec.habit?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rec.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rec.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || rec.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesPriority = selectedPriority === 'all' || rec.priority?.toLowerCase() === selectedPriority.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Get unique categories dynamically
  const categories = [...new Set(recommendations.map(r => r.category).filter(Boolean))];
  const priorities = ['high', 'medium', 'low'];

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPriority('all');
  };

  // Calculate average duration
  const avgDuration = recommendations.length > 0 
    ? Math.round(recommendations.reduce((acc, r) => acc + (r.duration || 0), 0) / recommendations.length)
    : 0;

  if (loading) {
    return <Loading text="your recommendations"/>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <PageHeader title="Your Health Recommendations" subTitle="Personalized habits to improve your wellbeing" />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon={TrendingUp}
          title="Total Habits"
          value={recommendations.length}
          color="blue" />
           <StatCard icon={Clock}
          title="Avg. Duration"
          value={`${avgDuration} min`}
          color="green" />
           <StatCard icon={Filter}
          title="Categories"
          value={categories.length}
          color="purple" />
          {/* 
          <RecommendationStatCard
            icon={Filter}
            label="Categories"
            value={categories.length}
            borderColor="border-purple-500"
            iconColor="text-purple-500"
          /> */}
        </div>

        {/* Search and Filters */}
        <RecommendationSearchFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedPriority={selectedPriority}
          setSelectedPriority={setSelectedPriority}
          categories={categories}
          priorities={priorities}
          clearAllFilters={clearAllFilters}
        />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-800">{filteredRecommendations.length}</span> of{' '}
            <span className="font-semibold text-gray-800">{recommendations.length}</span> recommendations
          </p>
        </div>

        {/* Recommendations Grid */}
        {filteredRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecommendations.map((rec, index) => (
              <RecommendationCard
                key={index}
                recommendation={rec}
                onAddToRoutine={addRoutine}
              />
            ))}
          </div>
        ) : (
          <RecommendationEmptyState onClearFilters={clearAllFilters} />
        )}
      </div>
    </div>
  );
};

export default Recommendations;