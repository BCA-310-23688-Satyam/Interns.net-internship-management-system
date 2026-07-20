import { useEffect } from "react";

import StatusBadge from "../../../components/ui/StatusBadge";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

function CompanyInternshipsPanel({
  internshipViews,
  internships,
  isLoading,
  isUpdatingId,
  onApplicantSearchChange,
  onLoadApplicants,
  onUpdateApplicationStatus
}) {
  return (
    <section className="dashboard-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Your roles</p>
          <h3>Posted Internships</h3>
        </div>
        <p className="panel-caption">{isLoading ? "Refreshing..." : "Ready"}</p>
      </div>

      <div className="stack-list">
        {!isLoading && internships.length === 0 ? (
          <div className="empty-state">
            <h4>No internships posted yet</h4>
            <p>Your published internships will appear here with their applicants.</p>
          </div>
        ) : null}

        {internships.map((internship) => (
          <CompanyInternshipCard
            key={internship._id}
            internship={internship}
            view={internshipViews[internship._id]}
            isUpdatingId={isUpdatingId}
            onApplicantSearchChange={onApplicantSearchChange}
            onLoadApplicants={onLoadApplicants}
            onUpdateApplicationStatus={onUpdateApplicationStatus}
          />
        ))}
      </div>
    </section>
  );
}

function CompanyInternshipCard({
  internship,
  view,
  isUpdatingId,
  onApplicantSearchChange,
  onLoadApplicants,
  onUpdateApplicationStatus
}) {
  const query = view?.query || "";
  const debouncedQuery = useDebouncedValue(query);
  const applicants = view?.applicants || internship.applicants || [];

  // The blank state can be rendered from the parent payload; only search terms
  // trigger a dedicated applicant request for this card.
  useDebouncedApplicantSearch({
    debouncedQuery,
    internshipId: internship._id,
    onLoadApplicants
  });

  return (
    <article className="company-role-card">
      <div className="panel-heading company-role-heading">
        <div>
          <p className="eyebrow">Internship</p>
          <h3>{internship.title}</h3>
        </div>
        <StatusBadge status={`${applicants.length} applicants`} />
      </div>

      <p className="company-role-description">{internship.description}</p>

      <label className="search-field company-search">
        <span>Search applicants</span>
        <input
          type="search"
          placeholder="Search by name or email"
          value={query}
          onChange={(event) => onApplicantSearchChange(internship._id, event.target.value)}
        />
      </label>

      <div className="stack-list">
        {view?.isLoading ? (
          <div className="empty-state">
            <h4>Loading applicants</h4>
            <p>Applicant records are being refreshed.</p>
          </div>
        ) : null}

        {!view?.isLoading && applicants.length === 0 ? (
          <div className="empty-state">
            <h4>No applicants found</h4>
            <p>This internship has no matching applicants yet.</p>
          </div>
        ) : null}

        {!view?.isLoading &&
          applicants.map((application) => (
            <article key={application._id} className="applicant-row">
              <div className="applicant-copy">
                <p className="application-company">{application.student?.email || "No email"}</p>
                <h4>{application.student?.name || "Applicant"}</h4>
              </div>

              <div className="applicant-actions">
                <StatusBadge status={application.status} />
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() =>
                    onUpdateApplicationStatus(internship._id, application._id, "Approved")
                  }
                  disabled={isUpdatingId === application._id}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() =>
                    onUpdateApplicationStatus(internship._id, application._id, "Rejected")
                  }
                  disabled={isUpdatingId === application._id}
                >
                  Reject
                </button>
              </div>
            </article>
          ))}
      </div>
    </article>
  );
}

function useDebouncedApplicantSearch({ debouncedQuery, internshipId, onLoadApplicants }) {
  const normalizedQuery = debouncedQuery.trim();

  // Search is remote so large applicant lists do not have to be filtered in the browser.
  useEffect(() => {
    if (!normalizedQuery) {
      return;
    }

    onLoadApplicants(internshipId, normalizedQuery);
  }, [internshipId, normalizedQuery, onLoadApplicants]);
}

export default CompanyInternshipsPanel;
