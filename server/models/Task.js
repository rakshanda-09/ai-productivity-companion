const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },

    deadline: { type: Date, required: true },
    estimatedMinutes: { type: Number, required: true, min: 5 },

    // 1 (low) - 5 (high), set by the user; combined with deadline/effort by the Priority Engine
    importance: { type: Number, min: 1, max: 5, default: 3 },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },

    // Written by services/priorityEngine.js whenever the task is created/recalculated
    priority: {
      level: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], default: "LOW" },
      score: { type: Number, default: 0 },
      calculatedAt: { type: Date, default: Date.now },
    },

    // Written by services/rescueEngine.js when this task is flagged at risk
    rescue: {
      riskLevel: { type: String, enum: ["SAFE", "HIGH_RISK", "CRITICAL"], default: "SAFE" },
      checkedAt: { type: Date, default: Date.now },
    },

    completedAt: { type: Date },
  },
  { timestamps: true }
);

taskSchema.index({ user: 1, deadline: 1 });

module.exports = mongoose.model("Task", taskSchema);
