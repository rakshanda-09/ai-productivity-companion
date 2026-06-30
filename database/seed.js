/**
 * Database seed script (MongoDB version).
 * Replaces the old schema.sql / seed.sql pair since the backend uses
 * Mongoose, not a SQL database — Mongoose's schemas (server/models/*.js)
 * already define structure, so there's nothing to migrate; this script
 * just inserts a demo account with a few tasks so the UI has data on first run.
 *
 * Usage:  cd server && npm run seed
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", "server", ".env") });
const mongoose = require("mongoose");
const path = require("path");

const User = require(path.join(__dirname, "..", "server", "models", "User"));
const Task = require(path.join(__dirname, "..", "server", "models", "Task"));
const { calculatePriority } = require(path.join(__dirname, "..", "server", "services", "priorityEngine"));

const DEMO_EMAIL = "demo@lastminute.dev";

async function run() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/last_minute_life_saver");
  console.log("[seed] connected");

  await User.deleteOne({ email: DEMO_EMAIL });
  const user = await User.create({
    name: "Demo User",
    email: DEMO_EMAIL,
    password: "password123",
  });

  const now = Date.now();
  const hrs = (h) => new Date(now + h * 60 * 60 * 1000);

  const seedTasks = [
    { title: "Submit final project report", deadline: hrs(5), estimatedMinutes: 180, importance: 5 },
    { title: "Reply to client emails", deadline: hrs(8), estimatedMinutes: 30, importance: 3 },
    { title: "Prepare slides for Monday meeting", deadline: hrs(30), estimatedMinutes: 90, importance: 4 },
    { title: "Refactor auth module", deadline: hrs(72), estimatedMinutes: 240, importance: 2 },
    { title: "Grocery run", deadline: hrs(20), estimatedMinutes: 45, importance: 1 },
  ];

  for (const t of seedTasks) {
    const task = new Task({ ...t, user: user._id });
    const priority = calculatePriority(task);
    task.priority = { ...priority, calculatedAt: new Date() };
    await task.save();
  }

  console.log(`[seed] created demo user (${DEMO_EMAIL} / password123) with ${seedTasks.length} tasks`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
