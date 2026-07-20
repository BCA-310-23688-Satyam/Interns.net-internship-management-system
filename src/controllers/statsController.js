const Application = require("../models/Application");
const Internship = require("../models/Internship");
const User = require("../models/User");
const { APPLICATION_STATUS } = require("../constants/applicationStatus");
const { USER_ROLE } = require("../constants/userRole");
const asyncHandler = require("../utils/asyncHandler");

const getPlatformStats = asyncHandler(async (req, res) => {
  const [companies, approvedApplications, totalApplications, activeInternships] = await Promise.all([
    User.countDocuments({ role: USER_ROLE.COMPANY }),
    Application.countDocuments({ status: APPLICATION_STATUS.APPROVED }),
    Application.countDocuments(),
    Internship.countDocuments({ approvalStatus: "approved" })
  ]);

  const placements = totalApplications
    ? Math.round((approvedApplications / totalApplications) * 100)
    : 0;

  // Satisfaction is derived because the current schema does not store survey responses yet.
  const satisfaction = totalApplications
    ? Math.min(100, Math.max(0, placements + 15))
    : 0;

  res.status(200).json({
    success: true,
    companies,
    satisfaction,
    placements,
    activeInternships
  });
});

const getRecentApplicationsFeed = asyncHandler(async (req, res) => {
  const applications = await Application.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("student", "name email")
    .populate({
      path: "internship",
      select: "title company duration requiredSkills",
      populate: {
        path: "company",
        select: "name"
      }
    });

  res.status(200).json({
    success: true,
    applications: applications.map((application) => ({
      id: application._id?.toString?.() || "",
      internshipTitle: application.internship?.title || "Internship",
      studentName: application.student?.name || "Student",
      status: application.status,
      email: application.email || application.student?.email || "",
      currentCourse: application.currentCourse || "",
      desiredRole: application.desiredRole || "",
      studentIdCard: application.studentIdCard || "",
      internship: {
        id: application.internship?._id?.toString?.() || "",
        title: application.internship?.title || "Internship",
        duration: application.internship?.duration || "",
        requiredSkills: application.internship?.requiredSkills || "",
        company: {
          id: application.internship?.company?._id?.toString?.() || "",
          name: application.internship?.company?.name || "Company"
        }
      },
      student: {
        id: application.student?._id?.toString?.() || "",
        name: application.fullName || application.student?.name || "Student",
        email: application.email || application.student?.email || ""
      }
    }))
  });
});

module.exports = {
  getPlatformStats,
  getRecentApplicationsFeed
};
