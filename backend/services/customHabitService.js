// services/userHabit.service.js
import Habit from "../models/Habit.js";

export const userHabitService = {
  addHabit(userId, data) {
    return Habit.create({ userId, ...data });
  },

  findHabits(userId) {
    return Habit.find({ userId });
  },

  deleteHabit(habitId) {
    return Habit.findByIdAndDelete(habitId);
  },

  findById(habitId) {
    return Habit.findById(habitId);
  }
};
