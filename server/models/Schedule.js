const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    priorityLevel: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], default: "LOW" },
  },
  { _id: false }
);

const scheduleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    // Normalized to midnight UTC of the day this schedule is for
    date: { type: Date, required: true },
    blocks: [blockSchema],
    unscheduledTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

scheduleSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Schedule", scheduleSchema);
