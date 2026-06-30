/**
 * Priority Engine
 * ----------------
 * Rule-based intelligent scoring (not a trained ML model — fully deterministic
 * and explainable, which matters for a productivity tool: users should be able
 * to trust *why* something is flagged CRITICAL).
 *
 * Score (0-100) blends three signals:
 *   - Urgency   (how little time is left before the deadline)
 *   - Importance (1-5 user-set weight)
 *   - Effort risk (does the remaining time even cover the estimated work?)
 */

const WEIGHTS = {
  urgency: 0.5,
  importance: 0.3,
  effortRisk: 0.2,
};

const LEVEL_THRESHOLDS = [
  { level: "CRITICAL", min: 75 },
  { level: "HIGH", min: 55 },
  { level: "MEDIUM", min: 30 },
  { level: "LOW", min: 0 },
];

function hoursUntil(date) {
  const ms = new Date(date).getTime() - Date.now();
  return ms / (1000 * 60 * 60);
}

/** 100 when overdue/right now, decaying smoothly as the deadline recedes. */
function urgencyScore(hoursLeft) {
  if (hoursLeft <= 0) return 100;
  // 1 day left -> ~67, 3 days -> ~40, 7 days -> ~22, 14 days -> ~13
  return Math.round(100 / (1 + hoursLeft / 24));
}

function importanceScore(importance = 3) {
  return Math.max(0, Math.min(100, importance * 20));
}

/** Penalizes tasks that need more time than realistically remains. */
function effortRiskScore(estimatedMinutes, hoursLeft) {
  if (hoursLeft <= 0) return 100;
  const estimatedHours = estimatedMinutes / 60;
  const ratio = estimatedHours / hoursLeft; // >1 means "not enough time at this pace"
  return Math.round(Math.min(100, ratio * 100));
}

function levelFromScore(score) {
  return LEVEL_THRESHOLDS.find((t) => score >= t.min).level;
}

/**
 * @param {{ deadline: Date|string, estimatedMinutes: number, importance: number }} task
 * @returns {{ score: number, level: 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL', breakdown: object, hoursLeft: number }}
 */
function calculatePriority(task) {
  const hoursLeft = hoursUntil(task.deadline);

  const u = urgencyScore(hoursLeft);
  const i = importanceScore(task.importance);
  const e = effortRiskScore(task.estimatedMinutes, hoursLeft);

  const score = Math.round(u * WEIGHTS.urgency + i * WEIGHTS.importance + e * WEIGHTS.effortRisk);
  const level = levelFromScore(score);

  return {
    score,
    level,
    breakdown: { urgency: u, importance: i, effortRisk: e },
    hoursLeft: Math.round(hoursLeft * 10) / 10,
  };
}

/** Re-ranks a list of tasks, highest score first. Pure function, no DB writes. */
function rankTasks(tasks) {
  return tasks
    .map((task) => ({ task, priority: calculatePriority(task) }))
    .sort((a, b) => b.priority.score - a.priority.score);
}

module.exports = { calculatePriority, rankTasks };
