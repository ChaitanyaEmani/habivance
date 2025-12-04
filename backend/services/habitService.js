import Habit from "../models/Habit.js";
import { calculateStreak, calculateLongestStreak } from "../utils/streakCalculator.js";

export const habitService = {

  async addHabit(userId, habitData) {

  // Normalize name for duplicate check
  const normalizedName = habitData.name.trim().toLowerCase();

  // Check if the user already has this habit (pending or completed)
  const existingHabit = await Habit.findOne({
    userId,
    name: { $regex: new RegExp(`^${normalizedName}$`, 'i') }
  });

  if (existingHabit) {
    throw {
      status: 409,
      message: "You have already done this habit earlier."
    };
  }

  // Save habit with normalized name
  return await Habit.create({
    userId,
    name: normalizedName,
    ...habitData,
  });
},

  
  async getUserHabits(userId) {
  const habits = await Habit.find({ userId }).sort({ createdAt: -1 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let habit of habits) {
    const lastEntry = habit.habitHistory[habit.habitHistory.length - 1];

    const lastEntryDate = lastEntry ? new Date(lastEntry.date) : null;
    if (lastEntryDate) lastEntryDate.setHours(0, 0, 0, 0);

    // If no record for today, add one (missed by default)
    if (!lastEntry || lastEntryDate.getTime() !== today.getTime()) {

      habit.habitHistory.push({
        date: today,
        status: "missed",
      });

      // Reset streak (missed)
      habit.streak = 0;

      await habit.save();
    }
  }

  return habits;
},


  async deleteHabit(habitId, userId) {
    return await Habit.findOneAndDelete({ _id: habitId, userId });
  },

  async completeHabit(habitId, userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const habit = await Habit.findOne({ _id: habitId, userId });
  if (!habit) return null;

  let todayEntry = habit.habitHistory.find(
    (h) => new Date(h.date).setHours(0,0,0,0) === today.getTime()
  );

  // If already completed → stop
  if (todayEntry && todayEntry.status === "completed") {
    return {
      error: true,
      message: "Already completed today"
    };
  }

  // If today exists but is "missed" → convert to completed
  if (todayEntry && todayEntry.status === "missed") {
    todayEntry.status = "completed";
  } 
  else {
    // Today entry does not exist → create new entry
    habit.habitHistory.push({
      date: today,
      status: "completed"
    });
  }

  // Recalculate streaks
  habit.streak = calculateStreak(habit.habitHistory);
  habit.longestStreak = calculateLongestStreak(habit.habitHistory);

  await habit.save();
  return habit;
}

};
