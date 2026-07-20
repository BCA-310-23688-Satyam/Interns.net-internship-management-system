const express = require("express");

const {
  registerUser,
  loginUser,
  loginAdmin,
  getCurrentUser,
  getStudentDashboard,
  getCompanyDashboard
} = require("../controllers/authController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin/login", loginAdmin);
router.get("/me", protect, getCurrentUser);
router.get("/student", protect, authorizeRoles("student"), getStudentDashboard);
router.get("/company", protect, authorizeRoles("company"), getCompanyDashboard);

module.exports = router;
