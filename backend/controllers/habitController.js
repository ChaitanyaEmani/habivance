import { habitService } from "../services/habitService.js";
import notificationService from '../services/notificationService.js';

export const addHabit = async (req, res) => {
  try {
    const habitData = await habitService.addHabit(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: "Habit added successfully",
      data: habitData,
    });

    // Create notification (non-blocking)
    notificationService.create(
      req.user._id,
      'New Habit Added 🎯',
      `"${habitData.habit}" has been added to your routine. Start building consistency today!`,
      'HABIT_ADDED',
      'low'
    ).then(() => {
      console.log('✅ Habit addition notification sent for:', habitData.habit);
    }).catch(err => {
      console.error('❌ Failed to create habit addition notification:', err.message);
    });

  } catch (error) {
    if (error.status === 409) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    return res
      .status(500)
      .json({ success: false, message: "Failed to add habit" });
  }
};


export const getHabits = async (req, res) => {
  try {
    const habits = await habitService.getUserHabits(req.user._id);

    res.status(200).json({
      success: true,
      data: habits,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Failed to get habits" });
  }
};

export const deleteHabit = async (req, res) => {
  try {
    // Get habit details before deletion
    const habits = await habitService.getUserHabits(req.user._id);
    const habitToDelete = habits.find(h => h._id.toString() === req.params.id);

    const result = await habitService.deleteHabit(req.params.id, req.user._id);

    if (!result) {
      return res.status(404).json({ success: false, message: "Habit not found" });
    }

    res.status(200).json({
      success: true,
      message: "Habit deleted successfully",
    });

    // Create deletion notification (non-blocking)
    if (habitToDelete) {
      const streakInfo = habitToDelete.currentStreak > 0 
        ? `You had a ${habitToDelete.currentStreak} day streak.` 
        : '';

      notificationService.create(
        req.user._id,
        'Habit Removed 🗑️',
        `"${habitToDelete.habit}" has been deleted from your routine. ${streakInfo}`,
        'HABIT_REMOVED',
        'low'
      ).then(() => {
        console.log('✅ Habit deletion notification sent for:', habitToDelete.habit);
      }).catch(err => {
        console.error('❌ Failed to create deletion notification:', err.message);
      });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to delete habit" });
  }
};

export const completeHabit = async (req, res) => {
  try {
    const habitData = await habitService.completeHabit(req.params.id, req.user._id);

    if (!habitData) {
      return res.status(404).json({ success: false, message: "Habit not found" });
    }

    res.status(200).json({
      success: true,
      message: "Habit completed",
      data: habitData,
    });

    // Correct streak values
    const currentStreak = habitData.currentStreak || habitData.streak || 0;
    const longestStreak = habitData.longestStreak || 0;
    const previousStreak = habitData.previousStreak || 0;

    // Completion notification
    const streakMessage =
      currentStreak > 1
        ? `${currentStreak} day streak! Keep it up!`
        : "Great start! Day 1 complete!";

    notificationService
      .create(
        req.user._id,
        "Habit Completed! 🎉",
        `You completed "${habitData.habit}". ${streakMessage}`,
        "HABIT_COMPLETED",
        "medium"
      )
      .then(() => console.log("✅ Habit completion notification sent"))
      .catch((err) =>
        console.error("❌ Failed to create completion notification:", err.message)
      );

    // Milestone notifications
    if ([7, 30, 100, 365].includes(currentStreak)) {
      const milestones = {
        7: "One Week",
        30: "One Month",
        100: "100 Days",
        365: "One Year",
      };

      notificationService
        .create(
          req.user._id,
          `Milestone Achieved! 🏆`,
          `Congratulations! You've maintained "${habitData.habit}" for ${milestones[currentStreak]}!`,
          "HABIT_MILESTONE",
          "high"
        )
        .then(() =>
          console.log(
            `✅ Milestone notification sent for ${currentStreak} day streak`
          )
        )
        .catch((err) =>
          console.error("❌ Failed to create milestone notification:", err.message)
        );
    }

    // New longest streak record
    if (currentStreak > 3 && currentStreak === longestStreak && currentStreak > previousStreak) {
      notificationService
        .create(
          req.user._id,
          "New Record! 🔥",
          `You've set a new personal record for "${habitData.habit}" with ${currentStreak} consecutive days!`,
          "HABIT_RECORD",
          "high"
        )
        .then(() => console.log("✅ New record notification sent"))
        .catch((err) =>
          console.error("❌ Failed to create record notification:", err.message)
        );
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to complete habit" });
  }
};
