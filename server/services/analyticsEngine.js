/**
 * Analytics Engine
 * ----------------
 * Computes lightweight, live stats from a user's tasks (no heavy aggregation
 * pipeline needed at this scale) and logs notable events so the Dashboard
 * has history to chart and the AI Coach has context to reason about.
 */

const Analytics = require("../models/Analytics");
const { findTasksAtRisk } = require("./rescueEngine");

function computeStats(tasks) {
  const completed = tasks.filter((t) => t.status === "completed");
  const pending = tasks.filter((t) => t.status !== "completed");
  const overdue = pending.filter((t) => new Date(t.deadline) < new Date());
  const atRisk = findTasksAtRisk(pending);

  const byLevel = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
  pending.forEach((t) => {
    const level = t.priority?.level || "LOW";
    byLevel[level] = (byLevel[level] || 0) + 1;
  });

  const completionRate = tasks.length ? Math.round((completed.length / tasks.length) * 100) : 0;

  return {
    totalTasks: tasks.length,
    completed: completed.length,
    pending: pending.length,
    overdue: overdue.length,
    atRisk: atRisk.length,
    completionRate,
    byPriorityLevel: byLevel,
  };
}

async function logEvent(userId, type, meta = {}) {
  try {
    await Analytics.create({ user: userId, type, meta });
  } catch (err) {
    // Analytics logging should never break the main request flow
    console.error(`[analytics] failed to log "${type}":`, err.message);
  }
}

async function recentActivity(userId, limit = 20) {
  return Analytics.find({ user: userId }).sort({ createdAt: -1 }).limit(limit);
}

module.exports = { computeStats, logEvent, recentActivity };
