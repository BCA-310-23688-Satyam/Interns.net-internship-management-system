function HeroSection({
  eyebrow,
  title,
  description,
  highlights = [],
  actions,
  aside
}) {
  return (
    <section className="hero">
      <div className="hero-copy card hero-card">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lead">{description}</p>
        {actions ? <div className="hero-actions">{actions}</div> : null}
      </div>

      <div className="hero-side">
        {highlights.length ? (
          <div className="card hero-card hero-card-compact">
            <p className="panel-kicker">Platform signals</p>
            <ul className="feature-list">
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {aside}
      </div>
    </section>
  );
}

export default HeroSection;
