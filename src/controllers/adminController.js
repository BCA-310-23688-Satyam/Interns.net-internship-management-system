const mongoose = require("mongoose");

const Application = require("../models/Application");
const Internship = require("../models/Internship");
const User = require("../models/User");
const { USER_ROLE } = require("../constants/userRole");
const asyncHandler = require("../utils/asyncHandler");
const { serializeApplication, serializeInternship } = require("../utils/serializers");

function buildSearchRegex(value = "") {
  const trimmed = value.trim();
  return trimmed ? new RegExp(trimmed, "i") : null;
}

function serializeUser(user) {
  return {
    id: user._id?.toString?.() || "",
    name: user.name || "",
    email: user.email || "",
    role: user.role || USER_ROLE.STUDENT,
    createdAt: user.createdAt || null,
    updatedAt: user.updatedAt || null
  };
}

async function removeApplicationsByIds(applicationIds) {
  if (!applicationIds.length) {
    return;
  }

  await Internship.updateMany(
    { applicants: { $in: applicationIds } },
    { $pull: { applicants: { $in: applicationIds } } }
  );
  await Application.deleteMany({ _id: { $in: applicationIds } });
}

async function deleteStudentData(studentId) {
  const applications = await Application.find({ student: studentId }).select("_id");
  const applicationIds = applications.map((application) => application._id);
  await removeApplicationsByIds(applicationIds);
}

async function deleteCompanyData(companyId) {
  const internships = await Internship.find({ company: companyId }).select("_id");
  const internshipIds = internships.map((internship) => internship._id);

  if (internshipIds.length) {
    const relatedApplications = await Application.find({ internship: { $in: internshipIds } }).select("_id");
    const relatedApplicationIds = relatedApplications.map((application) => application._id);
    await removeApplicationsByIds(relatedApplicationIds);
    await Internship.deleteMany({ _id: { $in: internshipIds } });
  }
}

const getDashboard = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    totalCompanies,
    totalInternships,
    totalApplications,
    latestUsers,
    latestInternships,
    latestApplications
  ] = await Promise.all([
    User.countDocuments({ role: USER_ROLE.STUDENT }),
    User.countDocuments({ role: USER_ROLE.COMPANY }),
    Internship.countDocuments(),
    Application.countDocuments(),
    User.find().sort({ createdAt: -1 }).limit(5).select("name email role createdAt"),
    Internship.find().sort({ createdAt: -1 }).limit(5).populate("company", "name"),
    Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("student", "name email")
      .populate({
        path: "internship",
        select: "title company duration requiredSkills description approvalStatus",
        populate: {
          path: "company",
          select: "name"
        }
      })
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalStudents,
      totalCompanies,
      totalInternships,
      totalApplications
    },
    latestRegistrations: latestUsers.map(serializeUser),
    latestInternships: latestInternships.map((internship) =>
      serializeInternship(internship, {
        applicationStatus: internship.approvalStatus || "approved",
        includeDescription: true,
        includeApplicantCount: true
      })
    ),
    latestApplications: latestApplications.map((application) =>
      serializeApplication(application, { includeStudentEmail: true })
    )
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const searchRegex = buildSearchRegex(req.query.search);
  const role = req.query.role?.trim();
  const query = {};

  if (role && Object.values(USER_ROLE).includes(role)) {
    query.role = role;
  }

  if (searchRegex) {
    query.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  const users = await User.find(query).sort({ createdAt: -1 }).select("name email role createdAt updatedAt");

  res.status(200).json({
    success: true,
    users: users.map(serializeUser)
  });
});

const getUserDetails = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid user id");
  }

  const user = await User.findById(req.params.id).select("name email role createdAt updatedAt");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const [applicationCount, internshipCount] = await Promise.all([
    Application.countDocuments({ student: user._id }),
    Internship.countDocuments({ company: user._id })
  ]);

  res.status(200).json({
    success: true,
    user: {
      ...serializeUser(user),
      applicationCount,
      internshipCount
    }
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid user id");
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: "You cannot delete your own admin account"
    });
  }

  if (user.role === USER_ROLE.STUDENT) {
    await deleteStudentData(user._id);
  }

  if (user.role === USER_ROLE.COMPANY) {
    await deleteCompanyData(user._id);
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });
});

const getInternships = asyncHandler(async (req, res) => {
  const searchRegex = buildSearchRegex(req.query.search);
  const approvalStatus = req.query.status?.trim();
  const query = {};

  if (approvalStatus && ["pending", "approved", "rejected"].includes(approvalStatus)) {
    query.approvalStatus = approvalStatus;
  }

  if (searchRegex) {
    query.$or = [{ title: searchRegex }, { requiredSkills: searchRegex }];
  }

  const internships = await Internship.find(query)
    .sort({ createdAt: -1 })
    .populate("company", "name");

  res.status(200).json({
    success: true,
    internships: internships.map((internship) =>
      serializeInternship(internship, {
        applicationStatus: internship.approvalStatus || "approved",
        includeDescription: true,
        includeApplicantCount: true
      })
    )
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

  const nextTitle = req.body.title?.trim?.();
  const nextDescription = req.body.description?.trim?.();
  const nextDuration = req.body.duration?.trim?.();
  const nextRequiredSkills = req.body.requiredSkills?.trim?.();
  const nextApprovalStatus = req.body.approvalStatus?.trim?.();

  if (nextTitle) {
    internship.title = nextTitle;
  }

  if (nextDescription) {
    internship.description = nextDescription;
  }

  if (nextDuration) {
    internship.duration = nextDuration;
  }

  if (nextRequiredSkills) {
    internship.requiredSkills = nextRequiredSkills;
  }

  if (nextApprovalStatus) {
    if (!["pending", "approved", "rejected"].includes(nextApprovalStatus)) {
      res.status(400);
      throw new Error("Invalid approval status");
    }

    internship.approvalStatus = nextApprovalStatus;
  }

  await internship.save();

  const updatedInternship = await Internship.findById(internship._id).populate("company", "name");

  res.status(200).json({
    success: true,
    message: "Internship updated successfully",
    internship: serializeInternship(updatedInternship, {
      applicationStatus: updatedInternship.approvalStatus || "approved",
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

  const relatedApplications = await Application.find({ internship: internship._id }).select("_id");
  const relatedApplicationIds = relatedApplications.map((application) => application._id);
  await removeApplicationsByIds(relatedApplicationIds);
  await internship.deleteOne();

  res.status(200).json({
    success: true,
    message: "Internship deleted successfully"
  });
});

const getApplications = asyncHandler(async (req, res) => {
  const searchRegex = buildSearchRegex(req.query.search);

  const applications = await Application.find()
    .sort({ createdAt: -1 })
    .populate("student", "name email")
    .populate({
      path: "internship",
      select: "title company duration requiredSkills description approvalStatus",
      populate: {
        path: "company",
        select: "name"
      }
    });

  const filteredApplications = searchRegex
    ? applications.filter((application) => {
        const values = [
          application.fullName,
          application.email,
          application.currentCourse,
          application.desiredRole,
          application.student?.name,
          application.student?.email,
          application.internship?.title,
          application.internship?.company?.name
        ];

        return values.some((value) => searchRegex.test(value || ""));
      })
    : applications;

  res.status(200).json({
    success: true,
    applications: filteredApplications.map((application) =>
      serializeApplication(application, { includeStudentEmail: true })
    )
  });
});

const deleteApplication = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid application id");
  }

  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  await Internship.updateOne({ _id: application.internship }, { $pull: { applicants: application._id } });
  await application.deleteOne();

  res.status(200).json({
    success: true,
    message: "Application deleted successfully"
  });
});

module.exports = {
  getDashboard,
  getUsers,
  getUserDetails,
  deleteUser,
  getInternships,
  updateInternship,
  deleteInternship,
  getApplications,
  deleteApplication
};
