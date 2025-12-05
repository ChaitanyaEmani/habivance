import express from "express";
import { addHabit, getHabits, deleteHabit, completeHabit } from "../controllers/habitController.js";
import { protect } from "../middlewares/authMiddleware.js";

// ⭐ import habit limiter
import { habitLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

// Add a new habit
router.post("/add", protect, habitLimiter, addHabit);

// Get user's habits
router.get("/", protect, habitLimiter, getHabits);

// Delete habit
router.delete("/:id", protect, habitLimiter, deleteHabit);

// Complete a habit (update streak)
router.post("/complete/:id", protect, habitLimiter, completeHabit);

export default router;
