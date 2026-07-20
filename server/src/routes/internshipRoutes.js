const express = require("express");

const {
  createInternship,
  getInternships,
  getInternshipById,
  updateInternship,
  deleteInternship
} = require("../controllers/internshipController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/")
  .get(getInternships)
  .post(protect, authorizeRoles("company"), createInternship);

router.route("/:id")
  .get(getInternshipById)
  .put(protect, authorizeRoles("company"), updateInternship)
  .delete(protect, authorizeRoles("company"), deleteInternship);

module.exports = router;
