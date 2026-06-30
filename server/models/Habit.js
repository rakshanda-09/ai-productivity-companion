const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },

    // How often this habit/goal expects a check-in
    frequency: { type: String, enum: ["daily", "weekdays", "weekly"], default: "daily" },

    // ISO date strings (YYYY-MM-DD) the user has checked in on — simple and
    // timezone-safe to compare/streak over without storing full Date objects.
    completedDates: { type: [String], default: [] },

    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },

    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

habitSchema.index({ user: 1, archived: 1 });

module.exports = mongoose.model("Habit", habitSchema);