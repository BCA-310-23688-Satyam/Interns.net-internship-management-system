const express = require("express");

const { getPlatformStats, getRecentApplicationsFeed } = require("../controllers/statsController");

const router = express.Router();

router.get("/", getPlatformStats);
router.get("/recent-applications", getRecentApplicationsFeed);

module.exports = router;
