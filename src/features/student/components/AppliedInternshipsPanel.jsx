import StatusBadge from "../../../components/ui/StatusBadge";

function AppliedInternshipsPanel({ applications }) {
  return (
    <section className="dashboard-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Progress</p>
          <h3>Applied Internships</h3>
        </div>
        <p className="panel-caption">Status tracking</p>
      </div>

      <div className="stack-list">
        {applications.length === 0 ? (
          <div className="empty-state">
            <h4>No applications yet</h4>
            <p>Your submitted internships will appear here with live status updates.</p>
          </div>
        ) : null}

        {applications.map((application) => (
          <article key={application._id} className="application-row">
            <div>
              <p className="application-company">
                {application.internship?.company?.name || "Company"}
              </p>
              <h4>{application.internship?.title || "Internship"}</h4>
            </div>
            <div className="application-meta">
              <StatusBadge status={application.status} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AppliedInternshipsPanel;
