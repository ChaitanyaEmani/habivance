// ============================================
// TIMER CONTROLLER WITH NOTIFICATIONS
// ============================================

import * as timerService from '../services/timerService.js';
import notificationService from '../services/notificationService.js';

export const startTimer = async (req, res) => {
  try {
    const { habitId } = req.body;
    
    if (!habitId) {
      return res.status(400).json({
        success: false,
        message: 'Habit ID is required',
      });
    }

    const habitData = await timerService.startTimer(habitId, req.user._id);
    
    res.status(200).json({
      success: true,
      message: 'Timer started successfully',
      data: habitData,
    });

    // Create timer start notification (non-blocking)
    notificationService.create(
      req.user._id,
      'Timer Started ⏱️',
      `Timer started for "${habitData.habit}". Stay focused and complete your session!`,
      'TIMER_STARTED',
      'low'
    ).then(() => {
      console.log('✅ Timer start notification sent for:', habitData.habit);
    }).catch(err => {
      console.error('❌ Failed to create timer start notification:', err.message);
    });

  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to start timer',
      });
    }
  }
};

export const stopTimer = async (req, res) => {
  try {
    const { habitId } = req.body;
    
    if (!habitId) {
      return res.status(400).json({
        success: false,
        message: 'Habit ID is required',
      });
    }

    const result = await timerService.stopTimer(habitId, req.user._id);
    
    // Send response immediately
    res.status(200).json({
      success: true,
      message: 'Timer stopped successfully',
      data: result.habit,
    });

    // Calculate session duration from the result
    const duration = result.totalDuration || 0;
    const minutes = Math.floor(duration);
    const seconds = Math.round((duration - minutes) * 60);
    const timeDisplay = minutes > 0 
      ? `${minutes}m ${seconds}s` 
      : `${seconds}s`;

    // Create timer completion notification (non-blocking)
    notificationService.create(
      req.user._id,
      'Session Completed! ✅',
      `Great job! You completed a ${timeDisplay} session for "${result.habit.habit}". Keep up the momentum!`,
      'TIMER_COMPLETED',
      'medium'
    ).then(() => {
      console.log('✅ Timer completion notification sent for:', result.habit.habit);
    }).catch(err => {
      console.error('❌ Failed to create timer completion notification:', err.message);
    });

    // Send milestone notification for long sessions (30min, 1hr, 2hrs)
    if (minutes >= 30) {
      const milestones = {
        30: '30 Minutes',
        60: '1 Hour',
        120: '2 Hours'
      };

      const milestone = [120, 60, 30].find(m => minutes >= m);
      if (milestone) {
        notificationService.create(
          req.user._id,
          'Focus Milestone! 🎯',
          `Amazing! You stayed focused for ${milestones[milestone]} on "${result.habit.habit}". Exceptional dedication!`,
          'TIMER_MILESTONE',
          'high'
        ).then(() => {
          console.log(`✅ Timer milestone notification sent for ${minutes} minutes`);
        }).catch(err => {
          console.error('❌ Failed to create milestone notification:', err.message);
        });
      }
    }

  } catch (error) {
    console.log('Error stopping timer:', error);
    if (!res.headersSent) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to stop timer',
      });
    }
  }
};

export const pauseTimer = async (req, res) => {
  try {
    const { habitId } = req.body;
    
    if (!habitId) {
      return res.status(400).json({
        success: false,
        message: 'Habit ID is required',
      });
    }

    const habitData = await timerService.pauseTimer(habitId, req.user._id);
    
    res.status(200).json({
      success: true,
      message: 'Timer paused successfully',
      data: habitData,
    });

    // Calculate elapsed time
    const duration = habitData.pausedDuration || 0;
    const minutes = Math.floor(duration);
    const seconds = Math.round((duration - minutes) * 60);
    const timeDisplay = minutes > 0 
      ? `${minutes}m ${seconds}s` 
      : `${seconds}s`;

    // Create pause notification (non-blocking)
    notificationService.create(
      req.user._id,
      'Timer Paused ⏸️',
      `Timer paused at ${timeDisplay} for "${habitData.habit}". Take a break, then come back strong!`,
      'TIMER_PAUSED',
      'low'
    ).then(() => {
      console.log('✅ Timer pause notification sent for:', habitData.habit);
    }).catch(err => {
      console.error('❌ Failed to create timer pause notification:', err.message);
    });

  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to pause timer',
      });
    }
  }
};

export const getTimerStatus = async (req, res) => {
  try {
    const { habitId } = req.params;
    const status = await timerService.getTimerStatus(habitId, req.user._id);
    
    res.status(200).json({
      success: true,
      message: 'Timer status retrieved successfully',
      data: status,
    });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      res.status(404).json({
        success: false,
        message: error.message || 'Failed to retrieve timer status',
      });
    }
  }
};