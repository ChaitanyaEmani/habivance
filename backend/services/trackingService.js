// Purpose: Habit completion tracking
// Functions: markAsCompleted(), markAsSkipped(), updateStreak()
// Logic: Update status, calculate consecutive completion days (streaks)

import DailyHabit from '../models/DailyHabit.js';
import { calculateStreak } from '../utils/streakCalculator.js';
import { sendStreakEmail } from '../utils/emailService.js';
import User from '../models/User.js';

export const markAsCompleted = async (dailyHabitId, userId) => {
  try {
    const dailyHabit = await DailyHabit.findOne({
      _id: dailyHabitId,
      userId,
    }).populate('habitId');

    if (!dailyHabit) {
      throw new Error('Daily habit not found');
    }

    // Stop timer if running
    if (dailyHabit.status === 'in-progress' && dailyHabit.startTime) {
      dailyHabit.endTime = new Date();
      const start = new Date(dailyHabit.startTime);
      const end = new Date(dailyHabit.endTime);
      const durationMs = end - start;
      dailyHabit.actualDuration = Math.round(durationMs / (1000 * 60));
    }

    // Mark as completed
    dailyHabit.status = 'completed';

    // Calculate and update streak
    const habitHistory = await DailyHabit.find({
      userId,
      habitId: dailyHabit.habitId._id,
    }).sort({ date: -1 });

    const streak = calculateStreak(habitHistory);
    dailyHabit.streak = streak;

    await dailyHabit.save();

    // Send streak email for milestones
    if (streak > 0 && (streak === 7 || streak === 30 || streak === 100 || streak % 50 === 0)) {
      try {
        const user = await User.findById(userId);
        if (user && user.email) {
          await sendStreakEmail(user.email, dailyHabit.habitId.habitName, streak);
        }
      } catch (emailError) {
        console.error('Streak email failed:', emailError);
        // Don't throw - email failure shouldn't prevent completion
      }
    }

    return dailyHabit;
  } catch (error) {
    console.error('Error marking habit as completed:', error);
    throw error;
  }
};

export const markAsSkipped = async (dailyHabitId, userId) => {
  try {
    const dailyHabit = await DailyHabit.findOne({
      _id: dailyHabitId,
      userId,
    }).populate('habitId');

    if (!dailyHabit) {
      throw new Error('Daily habit not found');
    }

    // Mark as skipped
    dailyHabit.status = 'skipped';
    dailyHabit.streak = 0; // Reset streak on skip

    await dailyHabit.save();
    return dailyHabit;
  } catch (error) {
    console.error('Error marking habit as skipped:', error);
    throw error;
  }
};

export const updateStreak = async (dailyHabitId, userId) => {
  try {
    const dailyHabit = await DailyHabit.findOne({
      _id: dailyHabitId,
      userId,
    });

    if (!dailyHabit) {
      throw new Error('Daily habit not found');
    }

    // Get habit history
    const habitHistory = await DailyHabit.find({
      userId,
      habitId: dailyHabit.habitId,
    }).sort({ date: -1 });

    const streak = calculateStreak(habitHistory);
    dailyHabit.streak = streak;

    await dailyHabit.save();
    return dailyHabit;
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
};

export const getHabitProgress = async (userId, habitId, days = 30) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const habits = await DailyHabit.find({
      userId,
      habitId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    const completed = habits.filter(h => h.status === 'completed').length;
    const skipped = habits.filter(h => h.status === 'skipped').length;
    const pending = habits.filter(h => h.status === 'pending').length;
    const total = habits.length;

    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(2) : 0;
    const totalTimeSpent = habits.reduce((sum, h) => sum + (h.actualDuration || 0), 0);

    return {
      habitId,
      period: `Last ${days} days`,
      total,
      completed,
      skipped,
      pending,
      completionRate: parseFloat(completionRate),
      totalTimeSpent,
      averageTimePerSession: total > 0 ? Math.round(totalTimeSpent / total) : 0,
    };
  } catch (error) {
    console.error('Error getting habit progress:', error);
    throw error;
  }
};