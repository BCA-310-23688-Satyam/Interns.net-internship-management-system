function MetricRow({ title, value, description, progress }) {
  return (
    <div className="metric-row dashboard-grid">
      <div>
        <p>{title}</p>
      </div>
      <div>
        <strong>{value}</strong>
      </div>
      <div>
        <p>{description}</p>
        {typeof progress === "number" ? (
          <progress value={progress} max="100">
            {progress}%
          </progress>
        ) : null}
      </div>
    </div>
  );
}

export default MetricRow;
