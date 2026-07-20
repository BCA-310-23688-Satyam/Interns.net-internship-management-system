import MetricRow from "./MetricRow";
import { buildMetricRows } from "../../lib/metricDefinitions";

function Dashboard({ stats }) {
  const metrics = buildMetricRows(stats);
  return (
    <section className="panel">
      <h1>Interns.Net Performance Overview</h1>
      <p>Track platform growth, placement momentum, satisfaction, and live internship activity.</p>
      {metrics.map((metric, index) => (
        <div key={metric.title}>
          <MetricRow {...metric} />
          {index < metrics.length - 1 ? <hr /> : null}
        </div>
      ))}
    </section>
  );
}

export default Dashboard;
