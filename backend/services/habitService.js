import Habit from "../models/Habit.js";
import User from "../models/User.js";
import { calculateStreak, calculateLongestStreak } from "../utils/streakCalculator.js";
import { sendStreakEmail } from "../utils/emailService.js";

export const habitService = {

  async addHabit(userId, habitData) {

  // Normalize name for duplicate check
  const normalizedName = habitData.habit.trim().toLowerCase();

  // Check if the user already has this habit (pending or completed)
  const existingHabit = await Habit.findOne({
    userId,
    habit: { $regex: new RegExp(`^${normalizedName}$`, 'i') }
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
    habit: normalizedName,
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
  console.log('=== COMPLETE HABIT DEBUG ===');
  console.log('habitId:', habitId);
  console.log('userId:', userId);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const habit = await Habit.findOne({ _id: habitId, userId });
  if (!habit) {
    console.log('❌ Habit not found');
    return null;
  }

  console.log('✅ Habit found:', habit.habit);

  let todayEntry = habit.habitHistory.find(
    (h) => new Date(h.date).setHours(0,0,0,0) === today.getTime()
  );

  // If already completed → stop
  if (todayEntry && todayEntry.status === "completed") {
    console.log('⚠️ Already completed today');
    return {
      error: true,
      message: "Already completed today"
    };
  }

  // If today exists but is "missed" → convert to completed
  if (todayEntry && todayEntry.status === "missed") {
    console.log('🔄 Converting missed to completed');
    todayEntry.status = "completed";
  } 
  else {
    console.log('➕ Adding new completed entry');
    // Today entry does not exist → create new entry
    habit.habitHistory.push({
      date: today,
      status: "completed"
    });
  }

  // Recalculate streaks
  const oldStreak = habit.streak;
  habit.streak = calculateStreak(habit.habitHistory);
  habit.longestStreak = calculateLongestStreak(habit.habitHistory);

  console.log('📊 Old Streak:', oldStreak);
  console.log('📊 New Streak:', habit.streak);
  console.log('📊 Longest Streak:', habit.longestStreak);

  await habit.save();
  console.log('💾 Habit saved to database');

  // Fetch user email from User model
  console.log('👤 Fetching user from database...');
  const user = await User.findById(userId);
  
  if (!user) {
    console.log('❌ User not found in database');
  } else {
    console.log('✅ User found:', user.name || user._id);
    console.log('📧 User email:', user.email);
  }

  const userEmail = user?.email;

  // Send streak email if user has built a streak
  console.log('📧 Checking email conditions...');
  console.log('   - userEmail exists?', !!userEmail);
  console.log('   - userEmail value:', userEmail);
  console.log('   - streak > 0?', habit.streak > 0);
  console.log('   - streak value:', habit.streak);

  if (userEmail && habit.streak > 0) {
    console.log('✅ Email conditions met! Sending email...');
    console.log('   To:', userEmail);
    console.log('   Habit:', habit.habit);
    console.log('   Streak:', habit.streak);
    
    try {
      const emailResult = await sendStreakEmail(userEmail, habit.habit, habit.streak);
      console.log('✅ Email sent successfully!', emailResult);
    } catch (error) {
      console.error('❌ Failed to send streak email:');
      console.error('   Error message:', error.message);
      console.error('   Error stack:', error.stack);
      // Don't fail the habit completion if email fails
    }
  } else {
    console.log('❌ Email NOT sent - conditions not met');
    if (!userEmail) console.log('   Reason: userEmail is missing or falsy');
    if (habit.streak <= 0) console.log('   Reason: streak is', habit.streak);
  }

  console.log('=== END COMPLETE HABIT DEBUG ===\n');
  return habit;
}

};