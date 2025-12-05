import Habit from '../models/Habit.js';

export const startTimer = async (habitId, userId) => {
  try {
    const habit = await Habit.findOne({
      _id: habitId,
      userId,
    });

    if (!habit) {
      throw new Error('Habit not found');
    }

    if (habit.timerStatus === 'running') {
      throw new Error('Timer is already running');
    }

    // Start or resume timer
    habit.startTime = new Date();
    habit.timerStatus = 'running';

    await habit.save();
    return habit;
  } catch (error) {
    console.error('Error starting timer:', error);
    throw error;
  }
};

export const stopTimer = async (habitId, userId) => {
  try {
    const habit = await Habit.findOne({
      _id: habitId,
      userId,
    });

    if (!habit) {
      throw new Error('Habit not found');
    }

    // Allow stopping from both running and paused states
    if (habit.timerStatus === 'idle') {
      throw new Error('Timer is not active');
    }

    let totalDuration = habit.pausedDuration || 0;

    // If timer is running, calculate current session duration
    if (habit.timerStatus === 'running' && habit.startTime) {
      const currentDuration = calculateDuration(habit.startTime, new Date());
      totalDuration += currentDuration;
    }

    // Check if habit is already completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEntry = habit.habitHistory.find(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });

    // Only add to history if not already completed today
    if (!todayEntry || todayEntry.status !== 'completed') {
      // Update streak only if completing for the first time today
      habit.streak += 1;
      if (habit.streak > habit.longestStreak) {
        habit.longestStreak = habit.streak;
      }

      // Add to history
      habit.habitHistory.push({
        date: new Date(),
        status: 'completed',
        duration: totalDuration,
      });
    } else {
      // Just update the duration if already completed
      todayEntry.duration = (todayEntry.duration || 0) + totalDuration;
    }

    // Reset timer state
    habit.timerStatus = 'idle';
    habit.startTime = null;
    habit.pausedDuration = 0;

    await habit.save();
    
    return {
      habit,
      totalDuration
    };
  } catch (error) {
    console.error('Error stopping timer:', error);
    throw error;
  }
};

export const pauseTimer = async (habitId, userId) => {
  try {
    const habit = await Habit.findOne({
      _id: habitId,
      userId,
    });

    if (!habit) {
      throw new Error('Habit not found');
    }

    if (habit.timerStatus !== 'running') {
      throw new Error('Timer is not running');
    }

    // Calculate duration so far and add to pausedDuration
    const currentDuration = calculateDuration(habit.startTime, new Date());
    habit.pausedDuration = (habit.pausedDuration || 0) + currentDuration;
    
    // Pause timer
    habit.timerStatus = 'paused';
    habit.startTime = null;

    await habit.save();
    return habit;
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
    
    // Calculate duration in minutes (with decimals for accuracy)
    const durationMs = end - start;
    const durationMinutes = durationMs / (1000 * 60);

    return durationMinutes > 0 ? durationMinutes : 0;
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 0;
  }
};

export const getTimerStatus = async (habitId, userId) => {
  try {
    const habit = await Habit.findOne({
      _id: habitId,
      userId,
    });

    if (!habit) {
      throw new Error('Habit not found');
    }

    let elapsedTime = habit.pausedDuration || 0;

    // If timer is running, add current elapsed time
    if (habit.timerStatus === 'running' && habit.startTime) {
      const currentElapsed = calculateDuration(habit.startTime, new Date());
      elapsedTime += currentElapsed;
    }

    return {
      habit,
      timerStatus: habit.timerStatus,
      isRunning: habit.timerStatus === 'running',
      isPaused: habit.timerStatus === 'paused',
      elapsedTime,
      startTime: habit.startTime,
    };
  } catch (error) {
    console.error('Error getting timer status:', error);
    throw error;
  }
};