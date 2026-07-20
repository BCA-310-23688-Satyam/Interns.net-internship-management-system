const express = require("express");

const { getApplications } = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getApplications);

module.exports = router;
