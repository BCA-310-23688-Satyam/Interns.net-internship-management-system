const INITIAL_APPLICATION_FORM = {
  fullName: "",
  email: "",
  currentCourse: "",
  desiredRole: "",
  studentIdCard: ""
};

export function createInitialApplicationForm(defaults = {}) {
  return {
    ...INITIAL_APPLICATION_FORM,
    ...defaults
  };
}

function ApplicationForm({
  errors,
  internshipTitle,
  isSubmitting,
  values,
  onCancel,
  onChange,
  onSubmit
}) {
  return (
    <form className="application-form-card" onSubmit={onSubmit} noValidate>
      <div className="application-form-head">
        <div>
          <p className="row-label">Application Details</p>
          <h4>{internshipTitle || "Apply to internship"}</h4>
        </div>
        <button type="button" className="button-ghost" onClick={onCancel} disabled={isSubmitting}>
          Close
        </button>
      </div>

      <div className="form-grid">
        <label className="form-field">
          <span>Full Name</span>
          <input
            type="text"
            name="fullName"
            placeholder="Aarav Sharma"
            value={values.fullName}
            onChange={onChange}
          />
          {errors.fullName ? <small>{errors.fullName}</small> : null}
        </label>

        <label className="form-field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            placeholder="aarav@example.com"
            value={values.email}
            onChange={onChange}
          />
          {errors.email ? <small>{errors.email}</small> : null}
        </label>

        <label className="form-field">
          <span>Current Course</span>
          <input
            type="text"
            name="currentCourse"
            placeholder="BCA CSE"
            value={values.currentCourse}
            onChange={onChange}
          />
          {errors.currentCourse ? <small>{errors.currentCourse}</small> : null}
        </label>

        <label className="form-field">
          <span>Desired Role</span>
          <input
            type="text"
            name="desiredRole"
            placeholder="Frontend Developer"
            value={values.desiredRole}
            onChange={onChange}
          />
          {errors.desiredRole ? <small>{errors.desiredRole}</small> : null}
        </label>
      </div>

      <label className="form-field">
        <span>Student ID Card</span>
        <input
          type="text"
          name="studentIdCard"
          placeholder="BCA-2026-014"
          value={values.studentIdCard}
          onChange={onChange}
        />
        {errors.studentIdCard ? <small>{errors.studentIdCard}</small> : null}
      </label>

      <div className="split-actions">
        <button type="submit" className="button-primary" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit application"}
        </button>
      </div>
    </form>
  );
}

export default ApplicationForm;
