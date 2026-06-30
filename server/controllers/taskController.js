const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");
const { calculatePriority } = require("../services/priorityEngine");
const { logEvent, computeStats } = require("../services/analyticsEngine");
const { ok, fail } = require("../utils/response");
const { isNonEmptyString, isFutureOrPresentDate, assert } = require("../utils/validators");

function attachPriority(taskDoc) {
  const priority = calculatePriority(taskDoc);
  taskDoc.priority = { ...priority, calculatedAt: new Date() };
  return taskDoc;
}

// @route POST /api/tasks
const createTask = asyncHandler(async (req, res) => {
  const { title, description, deadline, estimatedMinutes, importance } = req.body;

  assert(isNonEmptyString(title), "Title is required");
  assert(isFutureOrPresentDate(deadline), "A valid deadline is required");
  assert(Number(estimatedMinutes) >= 5, "Estimated time must be at least 5 minutes");

  const task = new Task({
    user: req.user._id,
    title,
    description,
    deadline,
    estimatedMinutes,
    importance: importance || 3,
  });

  attachPriority(task);
  await task.save();
  await logEvent(req.user._id, "task_created", { taskId: task._id, title: task.title });

  ok(res, { task }, 201);
});

// @route GET /api/tasks
const getTasks = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { user: req.user._id };
  if (status) filter.status = status;

  const tasks = await Task.find(filter).sort({ "priority.score": -1 });
  ok(res, { tasks, stats: computeStats(tasks) });
});

// @route GET /api/tasks/:id
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) return fail(res, "Task not found", 404);
  ok(res, { task });
});

// @route PUT /api/tasks/:id
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) return fail(res, "Task not found", 404);

  const editable = ["title", "description", "deadline", "estimatedMinutes", "importance", "status"];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) task[field] = req.body[field];
  });

  if (task.status === "completed" && !task.completedAt) {
    task.completedAt = new Date();
    await logEvent(req.user._id, "task_completed", { taskId: task._id, title: task.title });
  }

  // Recalculate priority whenever anything that affects it changes
  if (["deadline", "estimatedMinutes", "importance"].some((f) => req.body[f] !== undefined)) {
    attachPriority(task);
  }

  await task.save();
  ok(res, { task });
});

// @route DELETE /api/tasks/:id
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) return fail(res, "Task not found", 404);
  ok(res, { id: req.params.id });
});

// @route POST /api/tasks/recalculate  - re-scores every pending task (cron-friendly)
const recalculateAll = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id, status: { $ne: "completed" } });
  await Promise.all(
    tasks.map((task) => {
      attachPriority(task);
      return task.save();
    })
  );
  ok(res, { tasks });
});

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask, recalculateAll };
