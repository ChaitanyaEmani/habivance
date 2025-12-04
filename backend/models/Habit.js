import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "General",
    },
    description: {
      type: String,
      default: "",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    streak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    habitHistory: [
      {
        date: { type: Date, required: true },
        status: { type: String, enum: ["completed", "missed"], required: true },
        duration: { type: Number, default: 0 }, // Duration in minutes
      }
    ],
    // Timer fields
    timerStatus: {
      type: String,
      enum: ["idle", "running", "paused"],
      default: "idle",
    },
    startTime: {
      type: Date,
      default: null,
    },
    pausedDuration: {
      type: Number,
      default: 0, // Accumulated duration when paused (in minutes)
    },
  },
  { timestamps: true }
);

habitSchema.index({ userId: 1, name: 1 }, { unique: true });
export default mongoose.models.Habit || mongoose.model("Habit", habitSchema);
