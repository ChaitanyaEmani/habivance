import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    habit: {
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
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    streak: {
      type: Number,
      default: 0,
    },
    duration:{
      type: Number,
      default: 5,
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
