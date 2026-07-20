import ApplicationRow from "./ApplicationRow";

function ApplicationList({
  applications,
  isLoading,
  emptyTitle,
  emptyMessage,
  variant = "student",
  pendingId,
  onApprove,
  onReject
}) {
  if (isLoading) {
    return (
      <div className="state-block">
        <p className="state-title">Loading applications</p>
        <p className="state-copy">Pulling the latest candidate activity.</p>
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className="state-block">
        <p className="state-title">{emptyTitle}</p>
        <p className="state-copy">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="list-stack">
      {applications.map((application) => (
        <ApplicationRow
          key={application.id}
          application={application}
          variant={variant}
          pendingId={pendingId}
          onApprove={onApprove}
          onReject={onReject}
        />
      ))}
    </div>
  );
}

export default ApplicationList;
