const asyncHandler = require("express-async-handler");
const { verifyToken } = require("../config/jwt");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401);
      throw new Error("Not authorized, user no longer exists");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized, token invalid or expired");
  }
});

module.exports = { protect };
