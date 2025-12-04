
import * as analyticsService from '../services/analyticsService.js';

export const getDailyAnalytics = async (req, res) => {
  try {
    const { date } = req.query;
    const stats = await analyticsService.getDailyStats(req.user._id, date);
    res.status(200).json({
      success: true,
      message: 'Daily analytics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve daily analytics',
      error: error.message,
    });
  }
};

export const getWeeklyAnalytics = async (req, res) => {
  try {
    const stats = await analyticsService.getWeeklyStats(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Weekly analytics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve weekly analytics',
      error: error.message,
    });
  }
};

export const getMonthlyAnalytics = async (req, res) => {
  try {
    const stats = await analyticsService.getMonthlyStats(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Monthly analytics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve monthly analytics',
      error: error.message,
    });
  }
};

export const getStreaks = async (req, res) => {
  try {
    const streaks = await analyticsService.getStreaks(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Streaks retrieved successfully',
      count: streaks.length,
      data: streaks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve streaks',
      error: error.message,
    });
  }
};

export const getCompletionRate = async (req, res) => {
  try {
    const { days } = req.query;
    const rate = await analyticsService.getCompletionRate(
      req.user._id,
      days ? parseInt(days) : 30
    );
    res.status(200).json({
      success: true,
      message: 'Completion rate retrieved successfully',
      data: rate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve completion rate',
      error: error.message,
    });
  }
};
