// Purpose: Calculate consecutive completion days
// Function: calculateStreak(habitHistory)
// Logic: Count days where status = "completed" without gaps

export const calculateStreak = (habitHistory) => {
  if (!habitHistory || habitHistory.length === 0) {
    return 0;
  }

  // Sort by date (most recent first)
  const sortedHistory = habitHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedHistory.length; i++) {
    const habitDate = new Date(sortedHistory[i].date);
    habitDate.setHours(0, 0, 0, 0);

    // Check if habit was completed
    if (sortedHistory[i].status !== 'completed') {
      break;
    }

    // Calculate expected date for consecutive streak
    const expectedDate = new Date(currentDate);
    expectedDate.setDate(expectedDate.getDate() - i);

    // Check if the habit date matches expected consecutive date
    if (habitDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const calculateLongestStreak = (habitHistory) => {
  if (!habitHistory || habitHistory.length === 0) {
    return 0;
  }

  const sortedHistory = habitHistory.sort((a, b) => new Date(a.date) - new Date(b.date));

  let longestStreak = 0;
  let currentStreak = 0;
  let previousDate = null;

  sortedHistory.forEach((habit) => {
    if (habit.status === 'completed') {
      const habitDate = new Date(habit.date);
      habitDate.setHours(0, 0, 0, 0);

      if (previousDate) {
        const dayDifference = (habitDate - previousDate) / (1000 * 60 * 60 * 24);
        
        if (dayDifference === 1) {
          currentStreak++;
        } else {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      previousDate = habitDate;
    } else {
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 0;
      previousDate = null;
    }
  });

  return Math.max(longestStreak, currentStreak);
};

export const getStreakStatus = (streak) => {
  if (streak === 0) return { status: 'Start', message: 'Begin your journey!' };
  if (streak < 7) return { status: 'Building', message: 'Keep it up!' };
  if (streak < 30) return { status: 'Strong', message: 'Great progress!' };
  if (streak < 100) return { status: 'Champion', message: 'You\'re unstoppable!' };
  return { status: 'Legend', message: 'Amazing dedication!' };
};