function StatusBadge({ status }) {
  const normalizedStatus = status || "Open";
  const toneClass = getStatusToneClass(normalizedStatus);

  return <span className={`status ${toneClass}`}>{normalizedStatus}</span>;
}

function getStatusToneClass(status) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "open") {
    return "status-open";
  }

  if (normalizedStatus === "active") {
    return "status-active";
  }

  if (normalizedStatus === "applied") {
    return "status-applied";
  }

  if (normalizedStatus === "approved") {
    return "status-approved";
  }

  if (normalizedStatus === "rejected") {
    return "status-rejected";
  }

  return "status-neutral";
}

export default StatusBadge;
