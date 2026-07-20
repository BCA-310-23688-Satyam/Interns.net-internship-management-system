function InternshipRow({
  internship,
  actionLabel,
  pendingId,
  onAction,
  renderDetails,
  renderMeta,
  isActionDisabled
}) {
  const companyName = internship.company?.name || internship.company || "Company";
  const isDisabled =
    pendingId === internship.id ||
    actionLabel === null ||
    (typeof isActionDisabled === "function" && isActionDisabled(internship));

  return (
    <article className="internship-row">
      <div className="row-copy">
        <div className="row-heading">
          <div>
            <p className="row-label">{companyName}</p>
            <h3>{internship.title}</h3>
          </div>
        </div>
        {internship.description ? <p className="row-text">{internship.description}</p> : null}
        {renderDetails ? <div className="row-details">{renderDetails(internship)}</div> : null}
        {renderMeta ? <div className="row-meta">{renderMeta(internship)}</div> : null}
      </div>

      {onAction ? (
        <div className="row-actions">
          <button
            type="button"
            className="button-primary"
            onClick={() => onAction(internship)}
            disabled={isDisabled}
          >
            {pendingId === internship.id
              ? "Working..."
              : typeof actionLabel === "function"
                ? actionLabel(internship)
                : actionLabel}
          </button>
        </div>
      ) : null}
    </article>
  );
}

export default InternshipRow;
