const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");
const { assessTask, findTasksAtRisk } = require("../services/rescueEngine");
const { logEvent } = require("../services/analyticsEngine");
const { ok, fail } = require("../utils/response");

// @route GET /api/rescue  - scan every pending task and return ones at risk
const scan = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id, status: { $ne: "completed" } });
  const atRisk = findTasksAtRisk(tasks);

  const results = atRisk.map(({ task, assessment }) => ({
    task,
    ...assessment,
  }));

  if (results.length) {
    await logEvent(req.user._id, "rescue_triggered", { count: results.length });
  }

  // Persist the latest risk classification onto each task for badges elsewhere in the UI
  await Promise.all(
    atRisk.map(({ task, assessment }) =>
      Task.updateOne(
        { _id: task._id },
        { rescue: { riskLevel: assessment.riskLevel, checkedAt: assessment.checkedAt } }
      )
    )
  );

  ok(res, { atRisk: results });
});

// @route GET /api/rescue/:taskId  - single-task recovery plan
const planForTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.taskId, user: req.user._id });
  if (!task) return fail(res, "Task not found", 404);

  const assessment = assessTask(task);
  task.rescue = { riskLevel: assessment.riskLevel, checkedAt: assessment.checkedAt };
  await task.save();

  ok(res, { task, ...assessment });
});

module.exports = { scan, planForTask };
