// Purpose: Manage user's daily habit plan
// Routes: POST /daily-habits (add), GET /daily-habits (view), PUT /daily-habits/:id (update), DELETE /daily-habits/:id (remove)
// Actions: Add suggested habit to daily plan, set timeline, view today's habits

import * as dailyHabitService from '../services/dailyHabitService.js';
import * as notificationService from '../services/notificationService.js';

export const addHabit = async (req, res) => {
  try {
    const dailyHabit = await dailyHabitService.addHabitToDailyPlan(req.user._id, req.body);
    
    // Schedule notification if scheduled time is provided
    if (dailyHabit.scheduledTime) {
      await notificationService.scheduleAlert(dailyHabit._id);
    }

    res.status(201).json({
      success: true,
      message: 'Habit added to daily plan successfully',
      data: dailyHabit,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to add habit to daily plan',
    });
  }
};

export const getTodayHabits = async (req, res) => {
  try {
    const { date } = req.query;
    const habits = await dailyHabitService.getTodayHabits(req.user._id, date);
    res.status(200).json({
      success: true,
      message: 'Today\'s habits retrieved successfully',
      count: habits.length,
      data: habits,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve today\'s habits',
    });
  }
};

export const getHabitsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required',
      });
    }

    const habits = await dailyHabitService.getHabitsByDateRange(
      req.user._id,
      startDate,
      endDate
    );

    res.status(200).json({
      success: true,
      message: 'Habits retrieved successfully',
      count: habits.length,
      data: habits,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve habits by date range',
    });
  }
};

export const updateHabit = async (req, res) => {
  try {
    const dailyHabit = await dailyHabitService.updateDailyHabit(
      req.params.id,
      req.user._id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: 'Habit updated successfully',
      data: dailyHabit,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update habit',
    });
  }
};

export const removeHabit = async (req, res) => {
  try {
    const result = await dailyHabitService.removeDailyHabit(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      message: 'Habit removed successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to remove habit',
    });
  }
};

export const getHabitById = async (req, res) => {
  try {
    const dailyHabit = await dailyHabitService.getDailyHabitById(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      message: 'Habit details retrieved successfully',
      data: dailyHabit,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: error.message || 'Habit not found',
    });
  }
};