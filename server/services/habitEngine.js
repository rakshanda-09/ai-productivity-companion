/**
 * Habit Engine
 * ------------
 * Pure streak math for the Goal & Habit Tracking feature. Dates are stored
 * as "YYYY-MM-DD" strings (local calendar days, not full timestamps) so
 * streak comparisons never get tripped up by time-of-day or timezone drift.
 *
 * Three frequencies are supported:
 *   - daily:    every calendar day must be checked in to keep the streak
 *   - weekdays: Mon–Fri must be checked in; weekends don't break the streak
 *   - weekly:   one check-in per ISO week keeps the streak alive
 */

function dateStr(d) {
  return d.toISOString().slice(0, 10);
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function isApplicableDay(date, frequency) {
  if (frequency !== "weekdays") return true;
  const day = date.getDay();
  return day !== 0 && day !== 6; // skip Sun/Sat
}

function isoWeekKey(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${weekNo}`;
}

function computeWeeklyStreaks(completedDates) {
  const weekKeys = new Set(completedDates.map((s) => isoWeekKey(new Date(s))));
  if (!weekKeys.size) return { currentStreak: 0, longestStreak: 0 };

  // Walk backward week by week from the current week.
  let current = 0;
  let cursor = startOfToday();
  let firstIteration = true;
  while (true) {
    const key = isoWeekKey(cursor);
    if (weekKeys.has(key)) {
      current++;
    } else if (!firstIteration) {
      break; // a missed week (other than possibly the current, still-open one) ends the streak
    }
    firstIteration = false;
    cursor.setDate(cursor.getDate() - 7);
    if (current > 520) break; // 10-year safety cap
  }
  // Longest: count the largest run of consecutive week keys present.
  const sortedKeys = [...weekKeys].sort();
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sortedKeys.length; i++) {
    // crude but sufficient: ISO week keys sort lexicographically per year
    const [yPrev, wPrev] = sortedKeys[i - 1].split("-W").map(Number);
    const [yCur, wCur] = sortedKeys[i].split("-W").map(Number);
    const consecutive = (yPrev === yCur && wCur === wPrev + 1) || (yCur === yPrev + 1 && wPrev >= 52 && wCur === 1);
    run = consecutive ? run + 1 : 1;
    longest = Math.max(longest, run);
  }
  return { currentStreak: current, longestStreak: Math.max(longest, current) };
}

function computeStreaks(completedDates, frequency = "daily") {
  const unique = [...new Set(completedDates)];
  if (!unique.length) return { currentStreak: 0, longestStreak: 0 };

  if (frequency === "weekly") return computeWeeklyStreaks(unique);

  const set = new Set(unique);
  const sorted = [...unique].sort();

  // Longest streak: scan every applicable day between first and last completion.
  let longest = 0;
  let run = 0;
  const cursor = new Date(sorted[0]);
  const last = new Date(sorted[sorted.length - 1]);
  while (cursor <= last) {
    if (isApplicableDay(cursor, frequency)) {
      if (set.has(dateStr(cursor))) {
        run++;
        longest = Math.max(longest, run);
      } else {
        run = 0;
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  // Current streak: walk backward from today; today not yet done doesn't break it.
  let current = 0;
  const day = startOfToday();
  const todayStr = dateStr(startOfToday());
  while (true) {
    if (!isApplicableDay(day, frequency)) {
      day.setDate(day.getDate() - 1);
      continue;
    }
    const s = dateStr(day);
    if (set.has(s)) {
      current++;
      day.setDate(day.getDate() - 1);
    } else if (s === todayStr) {
      day.setDate(day.getDate() - 1); // forgive "not done yet today"
    } else {
      break;
    }
    if (current > 3650) break; // 10-year safety cap
  }

  return { currentStreak: current, longestStreak: Math.max(longest, current) };
}

/** Returns true if this habit is "due and not yet done" for today's applicable day. */
function isDueToday(habit) {
  const today = startOfToday();
  if (!isApplicableDay(today, habit.frequency)) return false;
  const key = habit.frequency === "weekly" ? isoWeekKey(today) : dateStr(today);
  const doneSet =
    habit.frequency === "weekly"
      ? new Set(habit.completedDates.map((s) => isoWeekKey(new Date(s))))
      : new Set(habit.completedDates);
  return !doneSet.has(key);
}

module.exports = { computeStreaks, isDueToday, dateStr, startOfToday };