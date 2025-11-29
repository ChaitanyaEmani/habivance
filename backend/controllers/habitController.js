// Purpose: Fetch all pre-defined habits from database
// Routes: GET /habits, GET /habits/:id, GET /habits/category/:category
// Actions: Return list of available habits (for display before recommendations)

import * as habitService from '../services/habitService.js';

export const getAllHabits = async (req, res) => {
  try {
    const { category, search } = req.query;
    const habits = await habitService.getAllHabits({ category, search });
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
      message: error.message || 'Failed to retrieve habits',
    });
  }
};

export const getHabitById = async (req, res) => {
  try {
    const habit = await habitService.getHabitById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Habit details retrieved successfully',
      data: habit,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: error.message || 'Habit not found',
    });
  }
};

export const getHabitsByCategory = async (req, res) => {
  try {
    // Normalize category input from client
    const normalizedCategory = req.params.category.replace(/\s+/g, '').toLowerCase();

    const habits = await habitService.getHabitsByCategory(normalizedCategory);

    res.status(200).json({
      success: true,
      message: 'Habits by category retrieved successfully',
      count: habits.length,
      data: habits,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve habits by category',
    });
  }
};



export const createHabit = async (req, res) => {
  try {
    const habit = await habitService.createHabit(req.body);
    res.status(201).json({
      success: true,
      message: 'Habit created successfully',
      data: habit,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create habit',
    });
  }
};

export const updateHabit = async (req, res) => {
  try {
    const habit = await habitService.updateHabit(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Habit updated successfully',
      data: habit,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update habit',
    });
  }
};

export const deleteHabit = async (req, res) => {
  try {
    const result = await habitService.deleteHabit(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Habit deleted successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete habit',
    });
  }
};