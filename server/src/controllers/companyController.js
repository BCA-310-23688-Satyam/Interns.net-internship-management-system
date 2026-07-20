const Application = require("../models/Application");
const Internship = require("../models/Internship");
const mongoose = require("mongoose");
const { APPLICATION_STATUS } = require("../constants/applicationStatus");
const asyncHandler = require("../utils/asyncHandler");
const { sendApplicationAcceptedEmail } = require("../utils/emailService");
const { serializeApplication, serializeInternship } = require("../utils/serializers");

const getCompanyInternships = asyncHandler(async (req, res) => {
  const internships = await Internship.find({ company: req.user._id })
    .sort({ createdAt: -1 })
    .populate("company", "name")
    .populate({
      path: "applicants",
      select: "status"
    });

  res.status(200).json({
    success: true,
    internships: internships.map((internship) =>
      serializeInternship(internship, {
        applicationStatus: "Active",
        includeDescription: true,
        includeApplicantCount: true
      })
    )
  });
});

const getInternshipApplicants = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.internshipId)) {
    res.status(400);
    throw new Error("Invalid internship id");
  }

  const internship = await Internship.findOne({
    _id: req.params.internshipId,
    company: req.user._id
  }).populate("company", "name");

  if (!internship) {
    res.status(404);
    throw new Error("Internship not found");
  }

  const searchTerm = (req.query.query || "").trim().toLowerCase();
  const applicationList = await Application.find({ internship: internship._id })
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
  const filteredApplications = searchTerm
    ? applicationList.filter((application) => {
        const studentName = application.student?.name?.toLowerCase() || "";
        const studentEmail = application.student?.email?.toLowerCase() || "";
        const applicantName = application.fullName?.toLowerCase() || "";
        const applicantEmail = application.email?.toLowerCase() || "";
        const currentCourse = application.currentCourse?.toLowerCase() || "";
        const desiredRole = application.desiredRole?.toLowerCase() || "";

        return (
          studentName.includes(searchTerm) ||
          studentEmail.includes(searchTerm) ||
          applicantName.includes(searchTerm) ||
          applicantEmail.includes(searchTerm) ||
          currentCourse.includes(searchTerm) ||
          desiredRole.includes(searchTerm)
        );
      })
    : applicationList;

  res.status(200).json({
    success: true,
    internship: serializeInternship(internship, {
      applicationStatus: "Active",
      includeDescription: true
    }),
    applications: filteredApplications.map((application) =>
      serializeApplication(application, { includeStudentEmail: true })
    )
  });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    res.status(400);
    throw new Error("Status is required");
  }

  if (![APPLICATION_STATUS.APPROVED, APPLICATION_STATUS.REJECTED].includes(status)) {
    res.status(400);
    throw new Error("Status must be either Approved or Rejected");
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.applicationId)) {
    res.status(400);
    throw new Error("Invalid application id");
  }

  const application = await Application.findById(req.params.applicationId).populate({
    path: "internship",
    select: "title company duration requiredSkills description",
    populate: {
      path: "company",
      select: "name"
    }
  });

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  const internshipCompanyId =
    application.internship.company?._id?.toString() || application.internship.company?.toString();

  if (internshipCompanyId !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Forbidden: you can only manage applications for your own internships");
  }

  application.status = status;
  await application.save();

  const updatedApplication = await Application.findById(application._id)
    .populate("student", "name email")
    .populate({
      path: "internship",
      select: "title company duration requiredSkills description",
      populate: {
        path: "company",
        select: "name"
      }
    });

  if (status === APPLICATION_STATUS.APPROVED) {
    const studentEmail = updatedApplication.student?.email || updatedApplication.email;
    const studentName = updatedApplication.student?.name || updatedApplication.fullName;
    const companyName = updatedApplication.internship?.company?.name || req.user.name;
    const internshipTitle = updatedApplication.internship?.title;

    try {
      await sendApplicationAcceptedEmail({
        to: studentEmail,
        studentName,
        companyName,
        internshipTitle
      });
      console.log(`Application accepted email sent to ${studentEmail}`);
    } catch (error) {
      console.error(`Failed to send application accepted email to ${studentEmail}:`, error.message);
    }
  }

  res.status(200).json({
    success: true,
    message: `Application ${status.toLowerCase()} successfully`,
    application: serializeApplication(updatedApplication, { includeStudentEmail: true })
  });
});

module.exports = {
  getCompanyInternships,
  getInternshipApplicants,
  updateApplicationStatus
};
