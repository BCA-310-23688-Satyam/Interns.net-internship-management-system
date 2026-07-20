const Internship = require("../models/Internship");
const Application = require("../models/Application");
const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const { serializeInternship } = require("../utils/serializers");

function normalizeInternshipPayload(payload = {}) {
  return {
    title: payload.title?.trim?.() || "",
    description: payload.description?.trim?.() || "",
    duration: payload.duration?.trim?.() || "",
    requiredSkills: payload.requiredSkills?.trim?.() || ""
  };
}

function validateInternshipPayload(payload) {
  if (!payload.title || !payload.description || !payload.duration || !payload.requiredSkills) {
    return "Title, description, duration, and required skills are required";
  }

  return "";
}

const createInternship = asyncHandler(async (req, res) => {
  const internshipPayload = normalizeInternshipPayload(req.body);
  const validationMessage = validateInternshipPayload(internshipPayload);

  if (validationMessage) {
    res.status(400);
    throw new Error(validationMessage);
  }

  const internship = await Internship.create({
    ...internshipPayload,
    company: req.user._id
  });
  const populatedInternship = await Internship.findById(internship._id).populate("company", "name");

  res.status(201).json({
    success: true,
    message: "Internship created successfully",
    internship: serializeInternship(populatedInternship, {
      applicationStatus: "Active",
      includeDescription: true,
      includeApplicantCount: true
    })
  });
});

const getInternships = asyncHandler(async (req, res) => {
  const internships = await Internship.find({ approvalStatus: "approved" })
    .sort({ createdAt: -1 })
    .populate("company", "name");

  res.status(200).json({
    success: true,
    internships: internships.map((internship) =>
      serializeInternship(internship, {
        applicationStatus: "Open",
        includeDescription: true
      })
    )
  });
});

const getInternshipById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid internship id");
  }

  const internship = await Internship.findById(req.params.id).populate("company", "name");

  if (!internship) {
    res.status(404);
    throw new Error("Internship not found");
  }

  res.status(200).json({
    success: true,
    internship: serializeInternship(internship, {
      applicationStatus: "Open",
      includeDescription: true
    })
  });
});

const updateInternship = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid internship id");
  }

  const internship = await Internship.findById(req.params.id);

  if (!internship) {
    res.status(404);
    throw new Error("Internship not found");
  }

  if (internship.company.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Forbidden: you can only update your own internships");
  }

  const internshipPayload = normalizeInternshipPayload(req.body);
  const validationMessage = validateInternshipPayload(internshipPayload);

  if (validationMessage) {
    res.status(400);
    throw new Error(validationMessage);
  }

  internship.title = internshipPayload.title;
  internship.description = internshipPayload.description;
  internship.duration = internshipPayload.duration;
  internship.requiredSkills = internshipPayload.requiredSkills;
  await internship.save();

  const populatedInternship = await Internship.findById(internship._id).populate("company", "name");

  res.status(200).json({
    success: true,
    message: "Internship updated successfully",
    internship: serializeInternship(populatedInternship, {
      applicationStatus: "Active",
      includeDescription: true,
      includeApplicantCount: true
    })
  });
});

const deleteInternship = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid internship id");
  }

  const internship = await Internship.findById(req.params.id);

  if (!internship) {
    res.status(404);
    throw new Error("Internship not found");
  }

  if (internship.company.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Forbidden: you can only delete your own internships");
  }

  await Application.deleteMany({ internship: internship._id });
  await internship.deleteOne();

  res.status(200).json({
    success: true,
    message: "Internship deleted successfully"
  });
});

module.exports = {
  createInternship,
  getInternships,
  getInternshipById,
  updateInternship,
  deleteInternship
};
