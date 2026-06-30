/**
 * Smart Scheduler Engine
 * ----------------------
 * Turns a flat task list into a concrete day plan:
 *   1. Sort by priority score (then deadline as a tiebreaker)
 *   2. Walk the user's working window in order
 *   3. Drop each task into the next free slot, inserting a short break
 *      after every focus block
 *   4. Anything that doesn't fit before the window closes is returned
 *      separately as "unscheduled" so the UI can flag it (often a sign
 *      Rescue Mode should kick in)
 */

const { calculatePriority } = require("./priorityEngine");

function parseHHMM(base, hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
}

/**
 * @param {Array} tasks - pending tasks (mongoose docs or plain objects)
 * @param {Object} options
 * @param {Date} options.day - which calendar day to schedule for
 * @param {{start:string,end:string}} options.workingHours - "09:00" style
 * @param {number} options.focusBlockMinutes - default block size cap
 * @param {number} options.breakMinutes - break inserted after each block
 */
function generateSchedule(tasks, options = {}) {
  const day = options.day || new Date();
  const workingHours = options.workingHours || { start: "09:00", end: "21:00" };
  const breakMinutes = options.breakMinutes ?? 10;

  const windowStart = parseHHMM(day, workingHours.start);
  const windowEnd = parseHHMM(day, workingHours.end);

  // Never schedule earlier than "right now" if we're building today's plan
  const now = new Date();
  let cursor = windowStart;
  if (now > windowStart && now.toDateString() === day.toDateString()) {
    cursor = now;
  }

  const ranked = tasks
    .map((task) => ({ task, priority: calculatePriority(task) }))
    .sort((a, b) => {
      if (b.priority.score !== a.priority.score) return b.priority.score - a.priority.score;
      return new Date(a.task.deadline) - new Date(b.task.deadline);
    });

  const blocks = [];
  const unscheduledTasks = [];

  for (const { task, priority } of ranked) {
    const durationMs = task.estimatedMinutes * 60 * 1000;
    const slotEnd = new Date(cursor.getTime() + durationMs);

    if (slotEnd > windowEnd) {
      unscheduledTasks.push(task._id || task.id);
      continue;
    }

    blocks.push({
      task: task._id || task.id,
      title: task.title,
      start: new Date(cursor),
      end: slotEnd,
      priorityLevel: priority.level,
    });

    cursor = new Date(slotEnd.getTime() + breakMinutes * 60 * 1000);
  }

  return {
    date: new Date(day.getFullYear(), day.getMonth(), day.getDate()),
    blocks,
    unscheduledTasks,
    generatedAt: new Date(),
  };
}

module.exports = { generateSchedule };
