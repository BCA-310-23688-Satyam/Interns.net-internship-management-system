const Application = require("../models/Application");
const Internship = require("../models/Internship");
const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const { serializeApplication, serializeInternship } = require("../utils/serializers");

function normalizeApplicationPayload(payload = {}) {
  return {
    fullName: payload.fullName?.trim?.() || "",
    email: payload.email?.trim?.() || "",
    currentCourse: payload.currentCourse?.trim?.() || "",
    desiredRole: payload.desiredRole?.trim?.() || "",
    studentIdCard: payload.studentIdCard?.trim?.() || ""
  };
}

function validateApplicationPayload(payload) {
  if (
    !payload.fullName ||
    !payload.email ||
    !payload.currentCourse ||
    !payload.desiredRole ||
    !payload.studentIdCard
  ) {
    return "Full name, email, current course, desired role, and student ID card are required";
  }

  return "";
}

const getAllInternshipsForStudent = asyncHandler(async (req, res) => {
  const internships = await Internship.find({ approvalStatus: "approved" })
    .sort({ createdAt: -1 })
    .populate("company", "name");
  const applications = await Application.find({ student: req.user._id }).select("internship status");
  const applicationMap = applications.reduce((accumulator, application) => {
    accumulator[application.internship.toString()] = application.status;
    return accumulator;
  }, {});

  res.status(200).json({
    success: true,
    internships: internships.map((internship) =>
      serializeInternship(internship, {
        applicationStatus: applicationMap[internship._id.toString()] || "Open",
        includeDescription: true
      })
    )
  });
});

const searchInternships = asyncHandler(async (req, res) => {
  const searchTerm = (req.query.query || "").trim();
  const normalizedPattern = new RegExp(searchTerm, "i");

  const internships = await Internship.find({ approvalStatus: "approved" })
    .sort({ createdAt: -1 })
    .populate("company", "name");
  const applications = await Application.find({ student: req.user._id }).select("internship status");
  const applicationMap = applications.reduce((accumulator, application) => {
    accumulator[application.internship.toString()] = application.status;
    return accumulator;
  }, {});

  const filteredInternships = internships.filter((internship) => {
    return (
      normalizedPattern.test(internship.title) ||
      normalizedPattern.test(internship.company?.name || "")
    );
  });

  res.status(200).json({
    success: true,
    internships: filteredInternships.map((internship) =>
      serializeInternship(internship, {
        applicationStatus: applicationMap[internship._id.toString()] || "Open",
        includeDescription: true
      })
    )
  });
});

const applyToInternship = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.internshipId)) {
    res.status(400);
    throw new Error("Invalid internship id");
  }

  const internship = await Internship.findById(req.params.internshipId).populate("company", "name");

  if (!internship) {
    res.status(404);
    throw new Error("Internship not found");
  }

  if (internship.approvalStatus !== "approved") {
    res.status(400);
    throw new Error("This internship is not open for applications");
  }

  const existingApplication = await Application.findOne({
    student: req.user._id,
    internship: internship._id
  });

  if (existingApplication) {
    res.status(400);
    throw new Error("You have already applied to this internship");
  }

  const applicationPayload = normalizeApplicationPayload(req.body);
  const validationMessage = validateApplicationPayload(applicationPayload);

  if (validationMessage) {
    res.status(400);
    throw new Error(validationMessage);
  }

  const application = await Application.create({
    ...applicationPayload,
    student: req.user._id,
    internship: internship._id
  });

  internship.applicants.push(application._id);
  await internship.save();

  const populatedApplication = await Application.findById(application._id)
    .populate("student", "name")
    .populate({
      path: "internship",
      select: "title company duration requiredSkills description",
      populate: {
        path: "company",
        select: "name"
      }
    });

  res.status(201).json({
    success: true,
    message: "Application submitted successfully",
    application: serializeApplication(populatedApplication)
  });
});

const getAppliedInternships = asyncHandler(async (req, res) => {
  const applications = await Application.find({ student: req.user._id })
    .sort({ createdAt: -1 })
    .populate("student", "name")
    .populate({
      path: "internship",
      select: "title company duration requiredSkills description",
      populate: {
        path: "company",
        select: "name"
      }
    });

  res.status(200).json({
    success: true,
    applications: applications.map((application) => serializeApplication(application))
  });
});

const trackApplicationStatus = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.applicationId)) {
    res.status(400);
    throw new Error("Invalid application id");
  }

  const application = await Application.findOne({
    _id: req.params.applicationId,
    student: req.user._id
  })
    .populate("student", "name")
    .populate({
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

  res.status(200).json({
    success: true,
    application: serializeApplication(application)
  });
});

module.exports = {
  getAllInternshipsForStudent,
  searchInternships,
  applyToInternship,
  getAppliedInternships,
  trackApplicationStatus
};
