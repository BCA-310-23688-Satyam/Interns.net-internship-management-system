function InternshipComposer({
  errors,
  isEditing,
  isSubmitting,
  values,
  onChange,
  onReset,
  onSubmit
}) {
  return (
      <form className="auth-form compact-form" onSubmit={onSubmit} noValidate>
        <label className="form-field">
          <span>Title</span>
          <input
            type="text"
            name="title"
            placeholder="Frontend Internship"
            value={values.title}
            onChange={onChange}
          />
          {errors.title ? <small>{errors.title}</small> : null}
        </label>

        <label className="form-field">
          <span>Description</span>
          <textarea
            name="description"
            placeholder="Describe the role, team, and expected work."
            value={values.description}
            onChange={onChange}
            rows="6"
          />
          {errors.description ? <small>{errors.description}</small> : null}
        </label>

        <label className="form-field">
          <span>Duration</span>
          <input
            type="text"
            name="duration"
            placeholder="2 Months"
            value={values.duration}
            onChange={onChange}
          />
          {errors.duration ? <small>{errors.duration}</small> : null}
        </label>

        <label className="form-field">
          <span>Required Skills</span>
          <textarea
            name="requiredSkills"
            placeholder="React, Node.js, communication skills, MongoDB basics"
            value={values.requiredSkills}
            onChange={onChange}
            rows="4"
          />
          {errors.requiredSkills ? <small>{errors.requiredSkills}</small> : null}
        </label>

        <div className="split-actions">
          <button type="submit" className="button-primary" disabled={isSubmitting}>
            {isSubmitting ? (isEditing ? "Saving..." : "Posting...") : isEditing ? "Save changes" : "Publish role"}
          </button>
          {isEditing ? (
            <button type="button" className="button-ghost" onClick={onReset} disabled={isSubmitting}>
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>
  );
}

export default InternshipComposer;
