// Purpose: Update habit completion status
// Routes: PUT /track/:id/complete, PUT /track/:id/skip
// Actions: Mark habit as completed/skipped, update streak count

import * as trackingService from '../services/trackingService.js';

export const markCompleted = async (req, res) => {
  try {
    const dailyHabit = await trackingService.markAsCompleted(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      message: 'Habit marked as completed successfully',
      data: dailyHabit,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to mark habit as completed',
    });
  }
};

export const markSkipped = async (req, res) => {
  try {
    const dailyHabit = await trackingService.markAsSkipped(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      message: 'Habit marked as skipped successfully',
      data: dailyHabit,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to mark habit as skipped',
    });
  }
};

export const updateStreak = async (req, res) => {
  try {
    const dailyHabit = await trackingService.updateStreak(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      message: 'Streak updated successfully',
      data: dailyHabit,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update streak',
    });
  }
};

export const getHabitProgress = async (req, res) => {
  try {
    const { habitId } = req.params;
    const { days } = req.query;
    
    const progress = await trackingService.getHabitProgress(
      req.user._id,
      habitId,
      days ? parseInt(days) : 30
    );

    res.status(200).json({
      success: true,
      message: 'Habit progress retrieved successfully',
      data: progress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve habit progress',
    });
  }
};