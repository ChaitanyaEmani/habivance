// Purpose: Daily habit management logic
// Functions: addHabitToDailyPlan(), getTodayHabits(), updateDailyHabit(), removeDailyHabit()
// Logic: Add habit to specific date, set scheduled time, update status

import DailyHabit from '../models/DailyHabit.js';
import Habit from '../models/Habit.js';

export const addHabitToDailyPlan = async (userId, habitData) => {
  try {
    const { habitId, date, scheduledTime, notes } = habitData;

    // Verify habit exists
    const habit = await Habit.findById(habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // Check if habit already exists for this date
    const habitDate = date ? new Date(date) : new Date();
    habitDate.setHours(0, 0, 0, 0);

    const existingHabit = await DailyHabit.findOne({
      userId,
      habitId,
      date: {
        $gte: habitDate,
        $lt: new Date(habitDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingHabit) {
      throw new Error('Habit already added for this date');
    }

    // Create daily habit
    const dailyHabit = await DailyHabit.create({
      userId,
      habitId,
      date: habitDate,
      scheduledTime,
      notes,
    });

    return await dailyHabit.populate('habitId');
  } catch (error) {
    console.error('Error in addHabitToDailyPlan:', error);
    throw new Error(error.message || 'Failed to add habit to daily plan');
  }
};

export const getTodayHabits = async (userId, date) => {
  try {
    const queryDate = date ? new Date(date) : new Date();
    queryDate.setHours(0, 0, 0, 0);

    const habits = await DailyHabit.find({
      userId,
      date: {
        $gte: queryDate,
        $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000),
      },
    })
      .populate('habitId')
      .sort({ scheduledTime: 1 });

    return habits;
  } catch (error) {
    console.error('Error in getTodayHabits:', error);
    throw new Error(error.message || 'Failed to retrieve today\'s habits');
  }
};

export const getHabitsByDateRange = async (userId, startDate, endDate) => {
  try {
    const habits = await DailyHabit.find({
      userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .populate('habitId')
      .sort({ date: -1, scheduledTime: 1 });

    return habits;
  } catch (error) {
    console.error('Error in getHabitsByDateRange:', error);
    throw new Error(error.message || 'Failed to retrieve habits by date range');
  }
};

export const updateDailyHabit = async (dailyHabitId, userId, updateData) => {
  try {
    const dailyHabit = await DailyHabit.findOne({
      _id: dailyHabitId,
      userId,
    });

    if (!dailyHabit) {
      throw new Error('Daily habit not found');
    }

    // Update allowed fields
    if (updateData.scheduledTime !== undefined) {
      dailyHabit.scheduledTime = updateData.scheduledTime;
    }
    if (updateData.notes !== undefined) {
      dailyHabit.notes = updateData.notes;
    }
    if (updateData.status) {
      dailyHabit.status = updateData.status;
    }

    await dailyHabit.save();
    return await dailyHabit.populate('habitId');
  } catch (error) {
    console.error('Error in updateDailyHabit:', error);
    throw new Error(error.message || 'Failed to update daily habit');
  }
};

export const removeDailyHabit = async (dailyHabitId, userId) => {
  try {
    const dailyHabit = await DailyHabit.findOne({
      _id: dailyHabitId,
      userId,
    });

    if (!dailyHabit) {
      throw new Error('Daily habit not found');
    }

    await dailyHabit.deleteOne();
    return { message: 'Habit removed from daily plan' };
  } catch (error) {
    console.error('Error in removeDailyHabit:', error);
    throw new Error(error.message || 'Failed to remove daily habit');
  }
};

export const getDailyHabitById = async (dailyHabitId, userId) => {
  try {
    const dailyHabit = await DailyHabit.findOne({
      _id: dailyHabitId,
      userId,
    }).populate('habitId');

    if (!dailyHabit) {
      throw new Error('Daily habit not found');
    }

    return dailyHabit;
  } catch (error) {
    console.error('Error in getDailyHabitById:', error);
    throw new Error(error.message || 'Failed to retrieve daily habit');
  }
};