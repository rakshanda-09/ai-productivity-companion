const express = require("express");
const { scan, planForTask } = require("../controllers/rescueController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.get("/", scan);
router.get("/:taskId", planForTask);

module.exports = router;
