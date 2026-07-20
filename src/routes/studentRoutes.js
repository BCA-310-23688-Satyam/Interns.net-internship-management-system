const express = require("express");

const {
  getAllInternshipsForStudent,
  searchInternships,
  applyToInternship,
  getAppliedInternships,
  trackApplicationStatus
} = require("../controllers/studentController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorizeRoles("student"));

router.get("/internships", getAllInternshipsForStudent);
router.get("/internships/search", searchInternships);
router.post("/internships/:internshipId/apply", applyToInternship);
router.get("/applications", getAppliedInternships);
router.get("/applications/:applicationId", trackApplicationStatus);

module.exports = router;
