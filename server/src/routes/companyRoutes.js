const express = require("express");

const {
  getCompanyInternships,
  getInternshipApplicants,
  updateApplicationStatus
} = require("../controllers/companyController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorizeRoles("company"));

router.get("/internships", getCompanyInternships);
router.get("/internships/:internshipId/applicants", getInternshipApplicants);
router.patch("/applications/:applicationId/status", updateApplicationStatus);

module.exports = router;
