const express = require("express");
const { createHabit, getHabits, checkIn, updateHabit, deleteHabit } = require("../controllers/habitController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.route("/").post(createHabit).get(getHabits);
router.post("/:id/checkin", checkIn);
router.route("/:id").put(updateHabit).delete(deleteHabit);

module.exports = router;