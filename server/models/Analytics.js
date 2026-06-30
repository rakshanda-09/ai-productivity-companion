const mongoose = require("mongoose");

// Lightweight event log that powers the Dashboard charts and gives the
// AI Coach real context about the user's recent behaviour.
const analyticsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: [
        "task_created",
        "task_completed",
        "task_overdue",
        "schedule_generated",
        "rescue_triggered",
        "coach_query",
      ],
      required: true,
    },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analytics", analyticsSchema);
