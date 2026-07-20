const express = require("express");

const {
  getDashboard,
  getUsers,
  getUserDetails,
  deleteUser,
  getInternships,
  updateInternship,
  deleteInternship,
  getApplications,
  deleteApplication
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.get("/users/:id", getUserDetails);
router.delete("/users/:id", deleteUser);
router.get("/internships", getInternships);
router.put("/internships/:id", updateInternship);
router.delete("/internships/:id", deleteInternship);
router.get("/applications", getApplications);
router.delete("/applications/:id", deleteApplication);

module.exports = router;
