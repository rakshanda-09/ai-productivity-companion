const express = require("express");
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  recalculateAll,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.route("/").post(createTask).get(getTasks);
router.post("/recalculate", recalculateAll);
router.route("/:id").get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
