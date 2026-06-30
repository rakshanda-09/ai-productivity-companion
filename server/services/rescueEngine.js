/**
 * Rescue Engine (Deadline Recovery Planner)
 * ------------------------------------------
 * Looks at how much time is left vs. how much work remains and:
 *   1. Classifies the risk: SAFE / HIGH_RISK / CRITICAL
 *   2. Generates a concrete, ordered recovery plan
 *
 * The ratio of estimated-work-hours to hours-left is the core signal -
 * the same "can this realistically get done in time" question a human
 * would ask, just made explicit and consistent.
 */

function hoursUntil(date) {
  return (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60);
}

function classifyRisk(hoursLeft, estimatedMinutes) {
  const estimatedHours = estimatedMinutes / 60;

  if (hoursLeft <= 0) return "CRITICAL";

  const ratio = estimatedHours / hoursLeft;
  if (ratio >= 0.85) return "CRITICAL";
  if (ratio >= 0.5) return "HIGH_RISK";
  return "SAFE";
}

const PLAYBOOKS = {
  CRITICAL: [
    "Stop planning, start moving — open the task right now and work on it for the next 25 minutes uninterrupted.",
    "Cut scope ruthlessly: identify the 20% of this task that satisfies the deadline, and do only that first.",
    "Silence every notification and close other tabs/apps for the next focus block.",
    "If finishing fully is no longer realistic, message whoever is expecting this now — an early heads-up beats a late surprise.",
    "Work in back-to-back sprints with 5-minute breaks until it's done; skip anything non-essential.",
  ],
  HIGH_RISK: [
    "Block out your very next free slot for this task before anything else claims it.",
    "Split the remaining work into 2-3 smaller chunks so progress feels concrete, not overwhelming.",
    "Knock out the hardest or most uncertain part first, while you still have buffer time if it runs long.",
    "Re-check progress at the halfway point — if you're behind, this becomes CRITICAL and scope should be cut then.",
  ],
  SAFE: [
    "You have a comfortable buffer — schedule this into your plan rather than reacting to it.",
    "Do a quick 5-minute scope check now so no hidden surprises show up later.",
    "Protect this buffer: don't let lower-priority tasks quietly eat into it.",
  ],
};

const RISK_COPY = {
  CRITICAL: "This is in the danger zone — there isn't much room left for anything but focused execution.",
  HIGH_RISK: "This is getting tight. It's still doable, but it needs a deliberate plan now, not later.",
  SAFE: "This one's under control for now.",
};

/**
 * @param {{deadline: Date|string, estimatedMinutes: number, title?: string}} task
 */
function assessTask(task) {
  const hoursLeft = hoursUntil(task.deadline);
  const riskLevel = classifyRisk(hoursLeft, task.estimatedMinutes);

  return {
    riskLevel,
    hoursLeft: Math.round(hoursLeft * 10) / 10,
    message: RISK_COPY[riskLevel],
    recoveryPlan: PLAYBOOKS[riskLevel],
    checkedAt: new Date(),
  };
}

/** Filters + assesses a batch of tasks, returning only those at risk. */
function findTasksAtRisk(tasks) {
  return tasks
    .filter((t) => t.status !== "completed")
    .map((task) => ({ task, assessment: assessTask(task) }))
    .filter(({ assessment }) => assessment.riskLevel !== "SAFE")
    .sort((a, b) => a.assessment.hoursLeft - b.assessment.hoursLeft);
}

module.exports = { assessTask, findTasksAtRisk };
