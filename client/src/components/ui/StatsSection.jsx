import Card from "./Card";
import PieChart from "./PieChart";

function StatsSection() {
  return (
    <section className="page page-section">
      <div className="panel dashboard-grid">
        <div className="row-copy">
          <p className="eyebrow">Trusted Outcomes</p>
          <h2>Trusted by Organizations & Students</h2>
          <p className="panel-copy">
            90% satisfaction rate across internships and placements.
          </p>
          <p className="row-text">
            Interns.Net supports a smoother internship process by keeping discovery, applications,
            and decisions aligned in one shared flow for institutions and employers.
          </p>
        </div>

        <Card className="hero-card hero-card-compact">
          <p className="panel-kicker">Satisfaction Snapshot</p>
          <PieChart />
        </Card>
      </div>
    </section>
  );
}

export default StatsSection;
