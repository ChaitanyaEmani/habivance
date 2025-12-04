import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  completeHabit,
  deleteHabit,
  addCustomHabit,
  getCustomHabits
} from "../controllers/customHabitController.js";

const router = express.Router();

// Add new habit
router.post("/add", protect, addCustomHabit);

// Mark as completed
router.post("/complete/:habitId", protect, completeHabit);

// Get all habits
router.get("/all", protect, getCustomHabits);

// Delete habit
router.delete("/:habitId", protect, deleteHabit);

export default router;
