const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { signToken } = require("../config/jwt");
const { ok, fail } = require("../utils/response");
const { isEmail, isNonEmptyString, assert } = require("../utils/validators");

// @route POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  assert(isNonEmptyString(name), "Name is required");
  assert(isEmail(email), "A valid email is required");
  assert(isNonEmptyString(password) && password.length >= 6, "Password must be at least 6 characters");

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return fail(res, "An account with that email already exists", 409);

  const user = await User.create({ name, email, password });
  const token = signToken({ id: user._id });

  ok(res, { user: user.toSafeObject(), token }, 201);
});

// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  assert(isEmail(email), "A valid email is required");
  assert(isNonEmptyString(password), "Password is required");

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return fail(res, "Invalid email or password", 401);
  }

  const token = signToken({ id: user._id });
  ok(res, { user: user.toSafeObject(), token });
});

// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  ok(res, { user: req.user.toSafeObject() });
});

// @route PUT /api/auth/me
const updateMe = asyncHandler(async (req, res) => {
  const { name, workingHours, preferences } = req.body;

  if (name) req.user.name = name;
  if (workingHours) req.user.workingHours = { ...req.user.workingHours.toObject(), ...workingHours };
  if (preferences) req.user.preferences = { ...req.user.preferences.toObject(), ...preferences };

  await req.user.save();
  ok(res, { user: req.user.toSafeObject() });
});

module.exports = { register, login, getMe, updateMe };
