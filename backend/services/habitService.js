// Purpose: Habit database operations
// Functions: getAllHabits(), getHabitById(), getHabitsByCategory()
// Logic: Query habits from database with filters

import Habit from '../models/Habit.js';

export const getAllHabits = async (filters = {}) => {
  try {
    const query = {};

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.search) {
      query.$or = [
        { habitName: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const habits = await Habit.find(query).sort({ category: 1, habitName: 1 });
    return habits;
  } catch (error) {
    console.error('Error in getAllHabits:', error);
    throw new Error(error.message || 'Failed to retrieve habits');
  }
};

export const getHabitById = async (habitId) => {
  try {
    const habit = await Habit.findById(habitId);

    if (!habit) {
      throw new Error('Habit not found');
    }

    return habit;
  } catch (error) {
    console.error('Error in getHabitById:', error);
    throw new Error(error.message || 'Failed to retrieve habit');
  }
};

export const getHabitsByCategory = async (categoryQuery) => {
  try {
    // Fetch all habits
    const habits = await Habit.find();

    // Filter in JS: normalize stored category and compare
    const filteredHabits = habits.filter(habit => 
      habit.category.replace(/\s+/g, '').toLowerCase() === categoryQuery
    );

    return filteredHabits.sort((a, b) => a.habitName.localeCompare(b.habitName));
  } catch (error) {
    console.error('Error in getHabitsByCategory:', error);
    throw new Error(error.message || 'Failed to retrieve habits by category');
  }
};


export const createHabit = async (habitData) => {
  try {
    const habit = await Habit.create(habitData);
    return habit;
  } catch (error) {
    console.error('Error in createHabit:', error);
    throw new Error(error.message || 'Failed to create habit');
  }
};

export const updateHabit = async (habitId, updateData) => {
  try {
    const habit = await Habit.findByIdAndUpdate(habitId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!habit) {
      throw new Error('Habit not found');
    }

    return habit;
  } catch (error) {
    console.error('Error in updateHabit:', error);
    throw new Error(error.message || 'Failed to update habit');
  }
};

export const deleteHabit = async (habitId) => {
  try {
    const habit = await Habit.findById(habitId);

    if (!habit) {
      throw new Error('Habit not found');
    }

    await habit.deleteOne();
    return { message: 'Habit deleted successfully' };
  } catch (error) {
    console.error('Error in deleteHabit:', error);
    throw new Error(error.message || 'Failed to delete habit');
  }
};