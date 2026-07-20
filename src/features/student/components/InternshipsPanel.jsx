import StatusBadge from "../../../components/ui/StatusBadge";

function InternshipsPanel({
  applicationMap,
  internships,
  isApplyingId,
  isRefreshing,
  onApply
}) {
  return (
    <section className="dashboard-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Open roles</p>
          <h3>All Internships</h3>
        </div>
        <p className="panel-caption">{isRefreshing ? "Refreshing..." : "Ready"}</p>
      </div>

      <div className="stack-list">
        {internships.length === 0 ? (
          <div className="empty-state">
            <h4>No internships found</h4>
            <p>Try a different search term or come back when new roles are posted.</p>
          </div>
        ) : null}

        {internships.map((internship) => {
          const application = applicationMap[internship._id];
          const companyName = internship.company?.name || "Company";

          return (
            <article key={internship._id} className="internship-row">
              <div className="internship-copy">
                <div className="row-topline">
                  <p>{companyName}</p>
                  <StatusBadge status={application?.status} />
                </div>
                <h4>{internship.title}</h4>
                <p>{internship.description}</p>
              </div>

              <div className="row-actions">
                {application ? (
                  <button type="button" className="ghost-button" disabled>
                    Applied
                  </button>
                ) : (
                  <button
                    type="button"
                    className="auth-button row-button"
                    onClick={() => onApply(internship._id)}
                    disabled={isApplyingId === internship._id}
                  >
                    {isApplyingId === internship._id ? "Applying..." : "Apply"}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default InternshipsPanel;
