// Purpose: Timer tracking logic
// Functions: startTimer(habitId), stopTimer(habitId), calculateDuration()
// Logic: Record start timestamp, calculate elapsed time, update actualDuration

import DailyHabit from '../models/DailyHabit.js';

export const startTimer = async (dailyHabitId, userId) => {
  try {
    const dailyHabit = await DailyHabit.findOne({
      _id: dailyHabitId,
      userId,
    });

    if (!dailyHabit) {
      throw new Error('Daily habit not found');
    }

    if (dailyHabit.status === 'in-progress') {
      throw new Error('Timer is already running');
    }

    if (dailyHabit.status === 'completed') {
      throw new Error('Habit is already completed');
    }

    // Start timer
    dailyHabit.startTime = new Date();
    dailyHabit.status = 'in-progress';
    dailyHabit.endTime = null;

    await dailyHabit.save();
    return await dailyHabit.populate('habitId');
  } catch (error) {
    console.error('Error starting timer:', error);
    throw error;
  }
};

export const stopTimer = async (dailyHabitId, userId) => {
  try {
    const dailyHabit = await DailyHabit.findOne({
      _id: dailyHabitId,
      userId,
    });

    if (!dailyHabit) {
      throw new Error('Daily habit not found');
    }

    if (dailyHabit.status !== 'in-progress') {
      throw new Error('Timer is not running');
    }

    // Stop timer
    dailyHabit.endTime = new Date();
    
    // Calculate duration
    const duration = calculateDuration(dailyHabit.startTime, dailyHabit.endTime);
    dailyHabit.actualDuration = duration;

    await dailyHabit.save();
    return await dailyHabit.populate('habitId');
  } catch (error) {
    console.error('Error stopping timer:', error);
    throw error;
  }
};

export const pauseTimer = async (dailyHabitId, userId) => {
  try {
    const dailyHabit = await DailyHabit.findOne({
      _id: dailyHabitId,
      userId,
    });

    if (!dailyHabit) {
      throw new Error('Daily habit not found');
    }

    if (dailyHabit.status !== 'in-progress') {
      throw new Error('Timer is not running');
    }

    // Calculate duration so far
    const currentDuration = calculateDuration(dailyHabit.startTime, new Date());
    dailyHabit.actualDuration = (dailyHabit.actualDuration || 0) + currentDuration;
    
    // Pause timer
    dailyHabit.status = 'pending';
    dailyHabit.startTime = null;

    await dailyHabit.save();
    return await dailyHabit.populate('habitId');
  } catch (error) {
    console.error('Error pausing timer:', error);
    throw error;
  }
};

export const calculateDuration = (startTime, endTime) => {
  try {
    if (!startTime || !endTime) {
      return 0;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    
    // Calculate duration in minutes
    const durationMs = end - start;
    const durationMinutes = Math.round(durationMs / (1000 * 60));

    return durationMinutes > 0 ? durationMinutes : 0;
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 0;
  }
};

export const getTimerStatus = async (dailyHabitId, userId) => {
  try {
    const dailyHabit = await DailyHabit.findOne({
      _id: dailyHabitId,
      userId,
    }).populate('habitId');

    if (!dailyHabit) {
      throw new Error('Daily habit not found');
    }

    let elapsedTime = dailyHabit.actualDuration || 0;

    // If timer is running, add current elapsed time
    if (dailyHabit.status === 'in-progress' && dailyHabit.startTime) {
      const currentElapsed = calculateDuration(dailyHabit.startTime, new Date());
      elapsedTime += currentElapsed;
    }

    return {
      dailyHabit,
      isRunning: dailyHabit.status === 'in-progress',
      elapsedTime,
      startTime: dailyHabit.startTime,
    };
  } catch (error) {
    console.error('Error getting timer status:', error);
    throw error;
  }
};