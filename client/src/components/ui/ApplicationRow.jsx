import StatusBadge from "./StatusBadge";

function ApplicationRow({ application, variant = "student", pendingId, onApprove, onReject }) {
  const internshipTitle = application.internship?.title || application.internshipTitle || "Internship";
  const companyName = application.internship?.company?.name || application.company || "Company";
  const applicantName = application.fullName || application.student?.name || application.studentName || "Student";
  const applicantEmail = application.email || application.student?.email || "";
  const desiredRole = application.desiredRole || "Not provided";
  const currentCourse = application.currentCourse || "Not provided";
  const studentIdCard = application.studentIdCard || "Not provided";
  const internshipDuration = application.internship?.duration || "";
  const internshipSkills = application.internship?.requiredSkills || "";

  if (variant === "company") {
    return (
      <article className="application-row">
        <div className="row-copy">
          <p className="row-label">{applicantEmail || "Applicant"}</p>
          <h3>{applicantName}</h3>
          <p className="row-text">Applied for {internshipTitle}</p>
          <div className="detail-grid">
            <span className="detail-chip">Course: {currentCourse}</span>
            <span className="detail-chip">Role: {desiredRole}</span>
            <span className="detail-chip">Student ID: {studentIdCard}</span>
            {internshipDuration ? <span className="detail-chip">Duration: {internshipDuration}</span> : null}
          </div>
          {internshipSkills ? <p className="row-text">Required skills: {internshipSkills}</p> : null}
        </div>

        <div className="row-actions row-actions-wide">
          <StatusBadge status={application.status} />
          <button
            type="button"
            className="button-secondary"
            onClick={() => onApprove(application)}
            disabled={pendingId === application.id}
          >
            {pendingId === application.id ? "Saving..." : "Approve"}
          </button>
          <button
            type="button"
            className="button-ghost"
            onClick={() => onReject(application)}
            disabled={pendingId === application.id}
          >
            Reject
          </button>
        </div>
      </article>
    );
  }

  if (variant === "overview") {
    return (
      <article className="application-row">
        <div className="row-copy">
          <p className="row-label">{companyName}</p>
          <h3>{applicantName}</h3>
          <p className="row-text">Applied for {internshipTitle}</p>
          <div className="detail-grid">
            <span className="detail-chip">Course: {currentCourse}</span>
            <span className="detail-chip">Role: {desiredRole}</span>
            {internshipDuration ? <span className="detail-chip">Duration: {internshipDuration}</span> : null}
          </div>
        </div>

        <div className="row-actions row-actions-wide">
          <StatusBadge status={application.status} />
        </div>
      </article>
    );
  }

  return (
    <article className="application-row">
      <div className="row-copy">
        <p className="row-label">{companyName}</p>
        <h3>{internshipTitle}</h3>
        <p className="row-text">Application for {desiredRole}</p>
        <div className="detail-grid">
          <span className="detail-chip">Name: {applicantName}</span>
          <span className="detail-chip">Email: {applicantEmail || "Not provided"}</span>
          <span className="detail-chip">Course: {currentCourse}</span>
          <span className="detail-chip">Student ID: {studentIdCard}</span>
          {internshipDuration ? <span className="detail-chip">Duration: {internshipDuration}</span> : null}
        </div>
        {internshipSkills ? <p className="row-text">Required skills: {internshipSkills}</p> : null}
      </div>

      <div className="row-actions row-actions-wide">
        <StatusBadge status={application.status} />
      </div>
    </article>
  );
}

export default ApplicationRow;
