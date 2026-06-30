const asyncHandler = require("express-async-handler");
const Habit = require("../models/Habit");
const { computeStreaks, isDueToday, dateStr, startOfToday } = require("../services/habitEngine");
const { logEvent } = require("../services/analyticsEngine");
const { ok, fail } = require("../utils/response");
const { isNonEmptyString, assert } = require("../utils/validators");

function withDerived(habitDoc) {
  const habit = habitDoc.toObject ? habitDoc.toObject() : habitDoc;
  return { ...habit, dueToday: isDueToday(habit) };
}

// @route POST /api/habits
const createHabit = asyncHandler(async (req, res) => {
  const { title, description, frequency } = req.body;
  assert(isNonEmptyString(title), "Title is required");

  const habit = await Habit.create({
    user: req.user._id,
    title,
    description,
    frequency: ["daily", "weekdays", "weekly"].includes(frequency) ? frequency : "daily",
  });

  await logEvent(req.user._id, "task_created", { habitId: habit._id, kind: "habit" });
  ok(res, { habit: withDerived(habit) }, 201);
});

// @route GET /api/habits
const getHabits = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ user: req.user._id, archived: false }).sort({ createdAt: -1 });
  ok(res, { habits: habits.map(withDerived) });
});

// @route POST /api/habits/:id/checkin  - toggles today's (or this week's) check-in
const checkIn = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
  if (!habit) return fail(res, "Habit not found", 404);

  const today = dateStr(startOfToday());
  const alreadyDone = habit.completedDates.includes(today);

  habit.completedDates = alreadyDone
    ? habit.completedDates.filter((d) => d !== today)
    : [...habit.completedDates, today];

  const { currentStreak, longestStreak } = computeStreaks(habit.completedDates, habit.frequency);
  habit.currentStreak = currentStreak;
  habit.longestStreak = longestStreak;
  await habit.save();

  ok(res, { habit: withDerived(habit) });
});

// @route PUT /api/habits/:id
const updateHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
  if (!habit) return fail(res, "Habit not found", 404);

  ["title", "description", "frequency", "archived"].forEach((field) => {
    if (req.body[field] !== undefined) habit[field] = req.body[field];
  });

  if (req.body.frequency) {
    const { currentStreak, longestStreak } = computeStreaks(habit.completedDates, habit.frequency);
    habit.currentStreak = currentStreak;
    habit.longestStreak = longestStreak;
  }

  await habit.save();
  ok(res, { habit: withDerived(habit) });
});

// @route DELETE /api/habits/:id
const deleteHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!habit) return fail(res, "Habit not found", 404);
  ok(res, { id: req.params.id });
});

module.exports = { createHabit, getHabits, checkIn, updateHabit, deleteHabit };