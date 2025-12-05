import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  TrendingUp,
  Target,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle2,
  Loader,
  Flame,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Loading from '../components/common/Loading';
import StatCard from '../components/common/StatCard';
import PageHeader from '../components/common/PageHeader';
const API_URL = import.meta.env.VITE_API_BASE_URL;

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [streaks, setStreaks] = useState([]);
  const [completionRate, setCompletionRate] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [daily, weekly, monthly, streakData, completion] = await Promise.all([
        axios.get(`${API_URL}/api/analytics/daily`, { headers }),
        axios.get(`${API_URL}/api/analytics/weekly`, { headers }),
        axios.get(`${API_URL}/api/analytics/monthly`, { headers }),
        axios.get(`${API_URL}/api/analytics/streaks`, { headers }),
        axios.get(`${API_URL}/api/analytics/completion-rate?days=30`, { headers }),
      ]);

      setDailyStats(daily.data.data);
      setWeeklyStats(weekly.data.data);
      setMonthlyStats(monthly.data.data);
      setStreaks(streakData.data.data);
      setCompletionRate(completion.data.data);

      

    } catch (error) {
      console.error('Error fetching analytics:', error);

      // Extract backend error message if present
      const msg = error.response?.data?.message || "Failed to load analytics";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };


  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const stats = useMemo(() => {
    if (selectedPeriod === 'daily') return dailyStats;
    if (selectedPeriod === 'weekly') return weeklyStats;
    return monthlyStats;
  }, [selectedPeriod, dailyStats, weeklyStats, monthlyStats]);

  const periodLabel = useMemo(() => {
    if (selectedPeriod === 'daily') return 'Today';
    if (selectedPeriod === 'weekly') return 'This week';
    return 'This month';
  }, [selectedPeriod]);

  if (loading) {
    return <Loading text="analytics" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <PageHeader title="Analytics Dashboard" subTitle="Track your progress and stay motivated" />

        {/* Period Selector */}
        <div className="flex gap-4 mb-8">
          {['daily', 'weekly', 'monthly'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {period === 'daily' ? 'Today' : period === 'weekly' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Habits"
            value={stats?.total || 0}
            subtitle={periodLabel}
            icon={Target}
            color="blue"
          />
          <StatCard
            title="Completed"
            value={stats?.completed || 0}
            subtitle="Great progress!"
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            title="Completion Rate"
            value={`${stats?.completionRate || 0}%`}
            subtitle="Keep it up!"
            icon={TrendingUp}
            color="purple"
          />
          {/* <StatCard
            title="Time Spent"
            value={formatTime(stats?.totalTimeSpent || 0)}
            subtitle="Total duration"
            icon={Clock}
            color="orange"
          /> */}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Progress Chart - Line Progress Bars */}
          {selectedPeriod === 'weekly' && weeklyStats?.dailyBreakdown && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Daily Progress
              </h3>
              <div className="space-y-3">
                {weeklyStats.dailyBreakdown.map((day, index) => {
                  const date = new Date(day.date);
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  const percentage = day.total > 0 ? (day.completed / day.total) * 100 : 0;

                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{dayName}</span>
                        <span className="text-sm text-gray-600">
                          {day.completed}/{day.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Monthly Habit Breakdown - Round Progress Bars */}
          {selectedPeriod === 'monthly' && monthlyStats?.habitBreakdown && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <PieChart className="w-6 h-6 text-purple-600" />
                Habit Performance
              </h3>
              <div className="space-y-6">
                {monthlyStats.habitBreakdown.slice(0, 5).map((habit, index) => {
                  const rate = habit.total > 0 ? ((habit.completed / habit.total) * 100).toFixed(1) : 0;
                  const circumference = 2 * Math.PI * 36;
                  const offset = circumference - (rate / 100) * circumference;

                  return (
                    <div key={index} className="flex items-center gap-4">
                      {/* Round Progress Bar */}
                      <div className="relative flex-shrink-0">
                        <svg className="w-20 h-20 transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke={`hsl(${(rate / 100) * 120}, 70%, 50%)`}
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            className="transition-all duration-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-800">{rate}%</span>
                        </div>
                      </div>
                      
                      {/* Habit Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{habit.habitName}</p>
                        <p className="text-xs text-gray-500">{habit.category}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                          <span>{habit.completed}/{habit.total}</span>
                          <span>•</span>
                          <span>{formatTime(habit.timeSpent)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Overall Completion Rate - Large Round Progress */}
          {completionRate && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-green-600" />
                30-Day Overview
              </h3>
              <div className="text-center py-8">
                <div className="relative inline-flex items-center justify-center w-40 h-40">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - completionRate.completionRate / 100)}`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute">
                    <p className="text-4xl font-bold text-gray-800">
                      {completionRate.completionRate}%
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mt-4">
                  {completionRate.completed} of {completionRate.total} habits completed
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Streaks Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            Your Streaks
          </h3>
          
          {streaks.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No streaks yet. Start completing habits!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {streaks.slice(0, 6).map((streak, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">{streak.habitName}</h4>
                      <p className="text-xs text-gray-500">{streak.category}</p>
                    </div>
                    {streak.currentStreak > 0 && (
                      <Flame className="w-5 h-5 text-orange-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {streak.currentStreak}
                      </p>
                      <p className="text-xs text-gray-500">Current Streak</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-700">
                        {streak.longestStreak}
                      </p>
                      <p className="text-xs text-gray-500">Best Streak</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default Analytics;