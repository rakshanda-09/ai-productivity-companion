const express = require("express");
const { ask } = require("../controllers/coachController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.post("/", ask);

module.exports = router;
