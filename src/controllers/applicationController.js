const Application = require("../models/Application");
const Internship = require("../models/Internship");
const { USER_ROLE } = require("../constants/userRole");
const asyncHandler = require("../utils/asyncHandler");
const { serializeApplication } = require("../utils/serializers");

const getApplications = asyncHandler(async (req, res) => {
  let applications = [];

  if (req.user.role === USER_ROLE.STUDENT) {
    applications = await Application.find({ student: req.user._id })
      .sort({ createdAt: -1 })
      .populate("student", "name email")
      .populate({
        path: "internship",
        select: "title company duration requiredSkills description",
        populate: {
          path: "company",
          select: "name"
        }
      });
  } else if (req.user.role === USER_ROLE.COMPANY) {
    const companyInternshipIds = await Internship.find({ company: req.user._id }).distinct("_id");

    applications = await Application.find({ internship: { $in: companyInternshipIds } })
      .sort({ createdAt: -1 })
      .populate("student", "name email")
      .populate({
        path: "internship",
        select: "title company duration requiredSkills description",
        populate: {
          path: "company",
          select: "name"
        }
      });
  } else {
    res.status(403);
    throw new Error("Access denied");
  }

  res.status(200).json({
    success: true,
    applications: applications.map((application) =>
      serializeApplication(application, { includeStudentEmail: req.user.role === USER_ROLE.COMPANY })
    )
  });
});

module.exports = {
  getApplications
};
