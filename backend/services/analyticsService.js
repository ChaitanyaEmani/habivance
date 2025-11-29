// Purpose: Progress calculation and statistics
// Functions: getDailyStats(), getWeeklyStats(), calculateStreaks(), getCompletionRate()
// Logic:
// Count completed vs pending habits
// Calculate total time spent per habit
// Generate chart data for frontend

import DailyHabit from '../models/DailyHabit.js';
import { calculateStreak, calculateLongestStreak } from '../utils/streakCalculator.js';

export const getDailyStats = async (userId, date) => {
  try {
    const queryDate = date ? new Date(date) : new Date();
    queryDate.setHours(0, 0, 0, 0);

    const habits = await DailyHabit.find({
      userId,
      date: {
        $gte: queryDate,
        $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000),
      },
    }).populate('habitId');

    const total = habits.length;
    const completed = habits.filter(h => h.status === 'completed').length;
    const inProgress = habits.filter(h => h.status === 'in-progress').length;
    const pending = habits.filter(h => h.status === 'pending').length;
    const skipped = habits.filter(h => h.status === 'skipped').length;

    const totalTimeSpent = habits.reduce((sum, h) => sum + (h.actualDuration || 0), 0);
    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(2) : 0;

    return {
      date: queryDate,
      total,
      completed,
      inProgress,
      pending,
      skipped,
      completionRate: parseFloat(completionRate),
      totalTimeSpent,
      habits: habits,
    };
  } catch (error) {
    console.error('Error in getDailyStats:', error);
    throw new Error('Failed to retrieve daily statistics');
  }
};

export const getWeeklyStats = async (userId) => {
  try {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const habits = await DailyHabit.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).populate('habitId');

    const dailyBreakdown = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      
      const dayHabits = habits.filter(h => {
        const habitDate = new Date(h.date);
        habitDate.setHours(0, 0, 0, 0);
        return habitDate.getTime() === currentDate.getTime();
      });

      dailyBreakdown.push({
        date: currentDate,
        total: dayHabits.length,
        completed: dayHabits.filter(h => h.status === 'completed').length,
        timeSpent: dayHabits.reduce((sum, h) => sum + (h.actualDuration || 0), 0),
      });
    }

    const total = habits.length;
    const completed = habits.filter(h => h.status === 'completed').length;
    const totalTimeSpent = habits.reduce((sum, h) => sum + (h.actualDuration || 0), 0);
    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(2) : 0;

    return {
      period: 'Last 7 days',
      startDate,
      endDate,
      total,
      completed,
      completionRate: parseFloat(completionRate),
      totalTimeSpent,
      averageTimePerDay: Math.round(totalTimeSpent / 7),
      dailyBreakdown,
    };
  } catch (error) {
    console.error('Error in getWeeklyStats:', error);
    throw new Error('Failed to retrieve weekly statistics');
  }
};

export const getMonthlyStats = async (userId) => {
  try {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 29);
    startDate.setHours(0, 0, 0, 0);

    const habits = await DailyHabit.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).populate('habitId');

    const total = habits.length;
    const completed = habits.filter(h => h.status === 'completed').length;
    const totalTimeSpent = habits.reduce((sum, h) => sum + (h.actualDuration || 0), 0);
    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(2) : 0;

    // Group by habit
    const habitStats = {};
    habits.forEach(h => {
      const habitId = h.habitId._id.toString();
      if (!habitStats[habitId]) {
        habitStats[habitId] = {
          habitName: h.habitId.habitName,
          category: h.habitId.category,
          total: 0,
          completed: 0,
          timeSpent: 0,
        };
      }
      habitStats[habitId].total++;
      if (h.status === 'completed') habitStats[habitId].completed++;
      habitStats[habitId].timeSpent += h.actualDuration || 0;
    });

    return {
      period: 'Last 30 days',
      startDate,
      endDate,
      total,
      completed,
      completionRate: parseFloat(completionRate),
      totalTimeSpent,
      averageTimePerDay: Math.round(totalTimeSpent / 30),
      habitBreakdown: Object.values(habitStats),
    };
  } catch (error) {
    console.error('Error in getMonthlyStats:', error);
    throw new Error('Failed to retrieve monthly statistics');
  }
};

export const getStreaks = async (userId) => {
  try {
    const habits = await DailyHabit.find({ userId })
      .populate('habitId')
      .sort({ date: -1 });

    // Group by habit
    const habitGroups = {};
    habits.forEach(h => {
      const habitId = h.habitId._id.toString();
      if (!habitGroups[habitId]) {
        habitGroups[habitId] = {
          habitId: h.habitId._id,
          habitName: h.habitId.habitName,
          category: h.habitId.category,
          history: [],
        };
      }
      habitGroups[habitId].history.push(h);
    });

    // Calculate streaks for each habit
    const streakData = Object.values(habitGroups).map(group => {
      const currentStreak = calculateStreak(group.history);
      const longestStreak = calculateLongestStreak(group.history);

      return {
        habitId: group.habitId,
        habitName: group.habitName,
        category: group.category,
        currentStreak,
        longestStreak,
      };
    });

    // Sort by current streak (highest first)
    streakData.sort((a, b) => b.currentStreak - a.currentStreak);

    return streakData;
  } catch (error) {
    console.error('Error in getStreaks:', error);
    throw new Error('Failed to retrieve streak data');
  }
};

export const getCompletionRate = async (userId, days = 30) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const habits = await DailyHabit.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const total = habits.length;
    const completed = habits.filter(h => h.status === 'completed').length;
    const rate = total > 0 ? ((completed / total) * 100).toFixed(2) : 0;

    return {
      period: `Last ${days} days`,
      total,
      completed,
      completionRate: parseFloat(rate),
    };
  } catch (error) {
    console.error('Error in getCompletionRate:', error);
    throw new Error('Failed to calculate completion rate');
  }
};