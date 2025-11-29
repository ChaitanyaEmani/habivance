// Purpose: Handle timer operations for habits
// Routes: POST /timer/start, POST /timer/stop, POST /timer/pause
// Actions: Record when user starts/stops habit timer, calculate actual duration

import * as timerService from '../services/timerService.js';

export const startTimer = async (req, res) => {
  try {
    const { dailyHabitId } = req.body;
    
    if (!dailyHabitId) {
      return res.status(400).json({
        success: false,
        message: 'Daily habit ID is required',
      });
    }

    const dailyHabit = await timerService.startTimer(dailyHabitId, req.user._id);
    res.status(200).json({
      success: true,
      message: 'Timer started successfully',
      data: dailyHabit,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to start timer',
    });
  }
};

export const stopTimer = async (req, res) => {
  try {
    const { dailyHabitId } = req.body;
    
    if (!dailyHabitId) {
      return res.status(400).json({
        success: false,
        message: 'Daily habit ID is required',
      });
    }

    const dailyHabit = await timerService.stopTimer(dailyHabitId, req.user._id);
    res.status(200).json({
      success: true,
      message: 'Timer stopped successfully',
      data: dailyHabit,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to stop timer',
    });
  }
};

export const pauseTimer = async (req, res) => {
  try {
    const { dailyHabitId } = req.body;
    
    if (!dailyHabitId) {
      return res.status(400).json({
        success: false,
        message: 'Daily habit ID is required',
      });
    }

    const dailyHabit = await timerService.pauseTimer(dailyHabitId, req.user._id);
    res.status(200).json({
      success: true,
      message: 'Timer paused successfully',
      data: dailyHabit,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to pause timer',
    });
  }
};

export const getTimerStatus = async (req, res) => {
  try {
    const { dailyHabitId } = req.params;
    const status = await timerService.getTimerStatus(dailyHabitId, req.user._id);
    res.status(200).json({
      success: true,
      message: 'Timer status retrieved successfully',
      data: status,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: error.message || 'Failed to retrieve timer status',
    });
  }
};