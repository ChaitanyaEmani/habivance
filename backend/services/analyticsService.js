
import Habit from '../models/Habit.js';
import { calculateStreak, calculateLongestStreak } from '../utils/streakCalculator.js';

export const getDailyStats = async (userId, date) => {
  try {
    const queryDate = date ? new Date(date) : new Date();
    queryDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(queryDate.getTime() + 24 * 60 * 60 * 1000);

    // Get all habits for the user
    const habits = await Habit.find({ userId });

    // Filter habits that have activity on the query date
    const habitsWithActivity = habits.filter(habit => {
      return habit.habitHistory.some(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === queryDate.getTime();
      });
    });

    const total = habitsWithActivity.length;
    const completed = habitsWithActivity.filter(habit => {
      const dayEntry = habit.habitHistory.find(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === queryDate.getTime();
      });
      return dayEntry && dayEntry.status === 'completed';
    }).length;

    const totalTimeSpent = habitsWithActivity.reduce((sum, habit) => {
      const dayEntry = habit.habitHistory.find(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === queryDate.getTime();
      });
      return sum + (dayEntry?.duration || 0);
    }, 0);

    const pending = total - completed;
    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(2) : 0;

    return {
      date: queryDate,
      total,
      completed,
      pending,
      completionRate: parseFloat(completionRate),
      totalTimeSpent,
      habits: habitsWithActivity.map(habit => ({
        _id: habit._id,
        name: habit.name,
        category: habit.category,
        status: habit.habitHistory.find(entry => {
          const entryDate = new Date(entry.date);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === queryDate.getTime();
        })?.status || 'pending',
      })),
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

    const habits = await Habit.find({ userId });

    const dailyBreakdown = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      currentDate.setHours(0, 0, 0, 0);

      let dayCompleted = 0;
      let dayTotal = 0;
      let dayTimeSpent = 0;

      habits.forEach(habit => {
        const entry = habit.habitHistory.find(e => {
          const entryDate = new Date(e.date);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === currentDate.getTime();
        });

        if (entry) {
          dayTotal++;
          if (entry.status === 'completed') {
            dayCompleted++;
          }
          dayTimeSpent += entry.duration || 0;
        }
      });

      dailyBreakdown.push({
        date: new Date(currentDate),
        total: dayTotal,
        completed: dayCompleted,
        timeSpent: dayTimeSpent,
      });
    }

    const total = dailyBreakdown.reduce((sum, day) => sum + day.total, 0);
    const completed = dailyBreakdown.reduce((sum, day) => sum + day.completed, 0);
    const totalTimeSpent = dailyBreakdown.reduce((sum, day) => sum + day.timeSpent, 0);
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

    const habits = await Habit.find({ userId });

    let total = 0;
    let completed = 0;
    let totalTimeSpent = 0;
    const habitStats = {};

    habits.forEach(habit => {
      const entriesInRange = habit.habitHistory.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate && entryDate <= endDate;
      });

      if (entriesInRange.length > 0) {
        const habitId = habit._id.toString();
        habitStats[habitId] = {
          habitName: habit.name,
          category: habit.category,
          total: entriesInRange.length,
          completed: entriesInRange.filter(e => e.status === 'completed').length,
          timeSpent: entriesInRange.reduce((sum, e) => sum + (e.duration || 0), 0),
        };

        total += entriesInRange.length;
        completed += habitStats[habitId].completed;
        totalTimeSpent += habitStats[habitId].timeSpent;
      }
    });

    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(2) : 0;

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
    const habits = await Habit.find({ userId });

    const streakData = habits.map(habit => {
      const currentStreak = calculateStreak(habit.habitHistory);
      const longestStreak = calculateLongestStreak(habit.habitHistory);

      return {
        habitId: habit._id,
        habitName: habit.name,
        category: habit.category,
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
    endDate.setHours(23, 59, 59, 999);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const habits = await Habit.find({ userId });

    let total = 0;
    let completed = 0;

    habits.forEach(habit => {
      const entriesInRange = habit.habitHistory.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate && entryDate <= endDate;
      });

      total += entriesInRange.length;
      completed += entriesInRange.filter(e => e.status === 'completed').length;
    });

    const rate = total > 0 ? ((completed / total) * 100).toFixed(2) : 0;

    return {
      period: `Last ${days} days`,
      startDate,
      endDate,
      total,
      completed,
      completionRate: parseFloat(rate),
    };
  } catch (error) {
    console.error('Error in getCompletionRate:', error);
    throw new Error('Failed to calculate completion rate');
  }
};
