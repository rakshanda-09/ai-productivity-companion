const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");
const Schedule = require("../models/Schedule");
const { generateSchedule } = require("../services/schedulerEngine");
const { logEvent } = require("../services/analyticsEngine");
const { ok, fail } = require("../utils/response");

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// @route POST /api/schedule/generate  body: { date? }
const generate = asyncHandler(async (req, res) => {
  const day = req.body.date ? new Date(req.body.date) : new Date();
  const tasks = await Task.find({ user: req.user._id, status: { $ne: "completed" } });

  const built = generateSchedule(tasks, {
    day,
    workingHours: req.user.workingHours,
    breakMinutes: req.user.preferences?.breakMinutes ?? 10,
  });

  const schedule = await Schedule.findOneAndUpdate(
    { user: req.user._id, date: startOfDay(day) },
    { ...built, user: req.user._id, date: startOfDay(day) },
    { upsert: true, new: true }
  );

  await logEvent(req.user._id, "schedule_generated", { date: startOfDay(day), blockCount: built.blocks.length });

  ok(res, { schedule });
});

// @route GET /api/schedule?date=YYYY-MM-DD
const getSchedule = asyncHandler(async (req, res) => {
  const day = req.query.date ? new Date(req.query.date) : new Date();
  const schedule = await Schedule.findOne({ user: req.user._id, date: startOfDay(day) }).populate(
    "blocks.task",
    "title status deadline"
  );

  if (!schedule) return ok(res, { schedule: null });
  ok(res, { schedule });
});

module.exports = { generate, getSchedule };
