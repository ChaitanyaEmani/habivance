// controllers/userDefinedHabit.controller.js
import Habit from "../models/Habit.js";
import notificationService from '../services/notificationService.js';
import {
  calculateStreak,
  calculateLongestStreak,
} from "../utils/streakCalculator.js"; 

// 📌 Add a new user-defined habit
export const addCustomHabit = async (req, res) => {
  try {
    const { habit, category, description, duration, priority } = req.body;
    const userId = req.user.id || req.user._id;

    // Validate required fields
    if (!habit || !duration) {
      return res.status(400).json({
        success: false,
        message: "habit and duration are required"
      });
    }

    // Check if habit already exists (case-insensitive)
    const existingHabit = await Habit.findOne({
      userId,
      habit: { $regex: new RegExp(`^${habit.trim()}$`, 'i') }
    });

    if (existingHabit) {
      return res.status(409).json({
        success: false,
        message: "A habit with this habit already exists"
      });
    }

    // Create new habit
    const newHabit = await Habit.create({
      userId,
      habit: habit.trim(),
      category: category || "General",
      description: description || "",
      duration,
      priority: priority || "medium",
      streak: 0,
      longestStreak: 0,
      habitHistory: []
    });

    // Send response first
    res.status(201).json({
      success: true,
      message: "Habit created successfully",
      data: newHabit
    });

    // Create notification (non-blocking)
    notificationService.create(
      userId,
      'New Habit Created 🎯',
      `"${newHabit.habit}" has been added to your routine. Start building your streak today!`,
      'HABIT_CREATED',
      'low'
    ).then(() => {
      console.log('✅ Habit creation notification sent for:', newHabit.name);
    }).catch(err => {
      console.error('❌ Failed to create habit notification:', err.message);
    });

  } catch (error) {
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A habit with this name already exists"
      });
    }

    console.error("Error adding habit:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add habit"
    });
  }
};


// 📌 Mark habit as completed for today
export const completeHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.user.id || req.user._id;

    const habit = await Habit.findById(habitId);
    if (!habit) {
      return res.status(404).json({ success: false, message: "Habit not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already completed today
    const alreadyCompleted = habit.habitHistory.find(
      (h) => new Date(h.date).getTime() === today.getTime()
    );

    if (alreadyCompleted) {
      return res.status(400).json({ success: false, message: "Already completed today" });
    }

    // Add today's entry
    habit.habitHistory.push({
      date: today,
      status: "completed",
    });

    // Recalculate streaks
    const oldStreak = habit.streak;
    habit.streak = calculateStreak(habit.habitHistory);
    habit.longestStreak = calculateLongestStreak(habit.habitHistory);

    await habit.save();

    // Send response first
    res.json({
      success: true,
      message: "Habit marked as completed",
      data: habit,
    });

    // Create completion notification (non-blocking)
    const streakMessage = habit.streak > 1 
      ? `${habit.streak} day streak! Keep it up!` 
      : 'Great start! Day 1 complete!';

    notificationService.create(
      userId,
      'Habit Completed! 🎉',
      `You completed "${habit.name}". ${streakMessage}`,
      'HABIT_COMPLETED',
      'medium'
    ).then(() => {
      console.log('✅ Habit completion notification sent for:', habit.name);
    }).catch(err => {
      console.error('❌ Failed to create completion notification:', err.message);
    });

    // Milestone notifications for special streaks
    if ([7, 30, 100, 365].includes(habit.streak)) {
      const milestones = {
        7: 'One Week',
        30: 'One Month',
        100: '100 Days',
        365: 'One Year'
      };

      notificationService.create(
        userId,
        `Milestone Achieved! 🏆`,
        `Congratulations! You've maintained "${habit.name}" for ${milestones[habit.streak]}! Amazing dedication!`,
        'HABIT_MILESTONE',
        'high'
      ).then(() => {
        console.log(`✅ Milestone notification sent for ${habit.streak} day streak`);
      }).catch(err => {
        console.error('❌ Failed to create milestone notification:', err.message);
      });
    }

    // New longest streak notification
    if (habit.streak > oldStreak && habit.streak === habit.longestStreak && habit.streak > 3) {
      notificationService.create(
        userId,
        'New Record! 🔥',
        `You've set a new personal record for "${habit.name}" with ${habit.streak} consecutive days!`,
        'HABIT_RECORD',
        'high'
      ).then(() => {
        console.log('✅ New record notification sent');
      }).catch(err => {
        console.error('❌ Failed to create record notification:', err.message);
      });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error updating habit" });
  }
};


// 📌 Get all habits of user
export const getCustomHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user._id });

    res.json({
      success: true,
      data: habits,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to fetch habits" });
  }
};


// 📌 Delete habit
export const deleteHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.user.id || req.user._id;

    const habit = await Habit.findById(habitId);
    
    if (!habit) {
      return res.status(404).json({ 
        success: false, 
        message: "Habit not found" 
      });
    }

    const habitName = habit.name;
    const finalStreak = habit.streak;

    await Habit.findByIdAndDelete(habitId);

    // Send response first
    res.json({
      success: true,
      message: "Habit deleted successfully",
    });

    // Create deletion notification (non-blocking)
    const streakInfo = finalStreak > 0 
      ? `You had a ${finalStreak} day streak.` 
      : '';

    notificationService.create(
      userId,
      'Habit Removed 🗑️',
      `"${habitName}" has been deleted from your routine. ${streakInfo}`,
      'HABIT_DELETED',
      'low'
    ).then(() => {
      console.log('✅ Habit deletion notification sent for:', habitName);
    }).catch(err => {
      console.error('❌ Failed to create deletion notification:', err.message);
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to delete habit" });
  }
};