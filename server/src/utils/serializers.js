function serializeInternship(internship, options = {}) {
  const {
    applicationStatus = "Open",
    includeApplicantCount = false,
    includeDescription = false
  } = options;

  const serialized = {
    id: internship._id?.toString?.() || internship.id || "",
    title: internship.title || "",
    company: {
      id: internship.company?._id?.toString?.() || internship.company?.toString?.() || "",
      name: internship.company?.name || "Company"
    },
    duration: internship.duration || "",
    requiredSkills: internship.requiredSkills || "",
    status: applicationStatus,
    approvalStatus: internship.approvalStatus || "approved",
    createdAt: internship.createdAt || null,
    updatedAt: internship.updatedAt || null
  };

  if (includeDescription) {
    serialized.description = internship.description || "";
  }

  if (includeApplicantCount) {
    serialized.applicantCount = Array.isArray(internship.applicants)
      ? internship.applicants.length
      : internship.applicantCount || 0;
  }

  return serialized;
}

function serializeApplication(application, options = {}) {
  const { includeStudentEmail = false } = options;
  const serialized = {
    id: application._id?.toString?.() || application.id || "",
    status: application.status,
    fullName: application.fullName || application.student?.name || "Student",
    email: application.email || application.student?.email || "",
    currentCourse: application.currentCourse || "",
    desiredRole: application.desiredRole || "",
    studentIdCard: application.studentIdCard || "",
    internship: {
      id: application.internship?._id?.toString?.() || application.internship?.toString?.() || "",
      title: application.internship?.title || "Internship",
      company: {
        id:
          application.internship?.company?._id?.toString?.() ||
          application.internship?.company?.toString?.() ||
          "",
        name: application.internship?.company?.name || "Company"
      },
      duration: application.internship?.duration || "",
      requiredSkills: application.internship?.requiredSkills || "",
      description: application.internship?.description || ""
    },
    student: {
      id: application.student?._id?.toString?.() || application.student?.toString?.() || "",
      name: application.student?.name || "Student"
    },
    createdAt: application.createdAt || null,
    updatedAt: application.updatedAt || null
  };

  if (includeStudentEmail) {
    serialized.student.email = application.student?.email || "";
  }

  return serialized;
}

module.exports = {
  serializeApplication,
  serializeInternship
};
