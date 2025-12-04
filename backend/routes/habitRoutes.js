import express from "express";
import { addHabit, getHabits, deleteHabit, completeHabit } from "../controllers/habitController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Add a new habit
router.post("/add", protect, addHabit);

// Get user's habits
router.get("/", protect, getHabits);

// Delete habit
router.delete("/:id", protect, deleteHabit);

// Complete a habit (update streak)
router.post("/complete/:id", protect, completeHabit);

export default router;
