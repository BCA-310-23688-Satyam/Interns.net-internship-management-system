import InternshipRow from "./InternshipRow";

function InternshipList({
  internships,
  isLoading,
  emptyTitle,
  emptyMessage,
  actionLabel,
  pendingId,
  onAction,
  renderDetails,
  renderMeta,
  isActionDisabled
}) {
  if (isLoading) {
    return (
      <div className="state-block">
        <p className="state-title">Loading internships</p>
        <p className="state-copy">Refreshing the latest roles and statuses.</p>
      </div>
    );
  }

  if (!internships.length) {
    return (
      <div className="state-block">
        <p className="state-title">{emptyTitle}</p>
        <p className="state-copy">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="list-stack">
      {internships.map((internship) => (
        <InternshipRow
          key={internship.id}
          internship={internship}
          actionLabel={actionLabel}
          pendingId={pendingId}
          onAction={onAction}
          renderDetails={renderDetails}
          renderMeta={renderMeta}
          isActionDisabled={isActionDisabled}
        />
      ))}
    </div>
  );
}

export default InternshipList;
