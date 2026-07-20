function AuthForm({
  title,
  subtitle,
  fields,
  values,
  errors,
  formError,
  isSubmitting,
  onChange,
  onSubmit,
  footer
}) {
  return (
    <main className="page auth-page">
      <section className="hero auth-hero">
        <div className="card hero-card auth-copy">
          <p className="eyebrow">Authentication</p>
          <h1>{title}</h1>
          <p className="lead">{subtitle}</p>
        </div>

        <div className="card panel auth-panel">
          <form className="auth-form" onSubmit={onSubmit} noValidate>
            {fields.map((field) => (
              <label key={field.name} className="form-field">
                <span>{field.label}</span>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={values[field.name]}
                    onChange={onChange}
                    aria-invalid={Boolean(errors[field.name])}
                  >
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={values[field.name]}
                    onChange={onChange}
                    aria-invalid={Boolean(errors[field.name])}
                  />
                )}
                {errors[field.name] ? <small>{errors[field.name]}</small> : null}
              </label>
            ))}

            {formError ? <p className="form-error">{formError}</p> : null}

            <button className="button-primary auth-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Please wait..." : title}
            </button>
          </form>

          <div className="auth-footer">{footer}</div>
        </div>
      </section>
    </main>
  );
}

export default AuthForm;
