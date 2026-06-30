const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");
const { getCoachReply } = require("../services/aiService");
const { computeStats, logEvent } = require("../services/analyticsEngine");
const { ok, fail } = require("../utils/response");
const { isNonEmptyString, assert } = require("../utils/validators");

// @route POST /api/coach  body: { message }
const ask = asyncHandler(async (req, res) => {
  const { message } = req.body;
  assert(isNonEmptyString(message), "Message is required");

  const tasks = await Task.find({ user: req.user._id, status: { $ne: "completed" } }).sort({
    "priority.score": -1,
  });
  const stats = computeStats(await Task.find({ user: req.user._id }));

  try {
    const reply = await getCoachReply(message, { tasks, stats });
    await logEvent(req.user._id, "coach_query", { message });
    ok(res, { reply });
  } catch (err) {
    // Surface a clean, actionable message rather than a raw 500 from the provider
    return fail(res, err.message, err.statusCode || 502);
  }
});

module.exports = { ask };
