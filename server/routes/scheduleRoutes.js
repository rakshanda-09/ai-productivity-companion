const express = require("express");
const { generate, getSchedule } = require("../controllers/scheduleController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.post("/generate", generate);
router.get("/", getSchedule);

module.exports = router;
