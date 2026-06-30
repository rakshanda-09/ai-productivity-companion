const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const rescueRoutes = require("./routes/rescueRoutes");
const coachRoutes = require("./routes/coachRoutes");
const habitRoutes = require("./routes/habitRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ success: true, message: "API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/rescue", rescueRoutes);
app.use("/api/coach", coachRoutes);
app.use("/api/habits", habitRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;