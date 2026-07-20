import { useEffect, useState } from "react";

import AdminEmptyState from "../../components/admin/AdminEmptyState";
import AdminLoadingState from "../../components/admin/AdminLoadingState";
import AdminStatCard from "../../components/admin/AdminStatCard";
import { adminService } from "../../services";

function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const response = await adminService.getDashboard();

        if (isMounted) {
          setData(response);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Unable to load admin dashboard.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <AdminLoadingState label="Loading admin dashboard..." />;
  }

  if (error) {
    return <p className="notice notice-error">{error}</p>;
  }

  const stats = data?.stats || {};
  const latestRegistrations = data?.latestRegistrations || [];
  const latestInternships = data?.latestInternships || [];
  const latestApplications = data?.latestApplications || [];

  return (
    <section className="admin-page-stack">
      <div className="admin-section-heading">
        <p className="eyebrow">Overview</p>
        <h2>Platform Snapshot</h2>
      </div>

      <div className="admin-stats-grid">
        <AdminStatCard label="Total Students" value={stats.totalStudents} />
        <AdminStatCard label="Total Companies" value={stats.totalCompanies} />
        <AdminStatCard label="Total Internships" value={stats.totalInternships} />
        <AdminStatCard label="Total Applications" value={stats.totalApplications} />
      </div>

      <div className="admin-grid-two">
        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Recent</p>
              <h2>Latest Registrations</h2>
            </div>
          </div>
          {latestRegistrations.length ? (
            <div className="admin-feed-list">
              {latestRegistrations.map((user) => (
                <article key={user.id} className="admin-feed-item">
                  <strong>{user.name || "Unknown User"}</strong>
                  <p>{user.email || "No email"}</p>
                  <span>{user.role || "student"}</span>
                </article>
              ))}
            </div>
          ) : (
            <AdminEmptyState title="No registrations yet" description="New users will appear here." />
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Recent</p>
              <h2>Latest Internships</h2>
            </div>
          </div>
          {latestInternships.length ? (
            <div className="admin-feed-list">
              {latestInternships.map((internship) => (
                <article key={internship.id} className="admin-feed-item">
                  <strong>{internship.title || "Untitled Internship"}</strong>
                  <p>{internship.company?.name || "Unknown Company"}</p>
                  <span>{internship.approvalStatus || "approved"}</span>
                </article>
              ))}
            </div>
          ) : (
            <AdminEmptyState title="No internships yet" description="Posted internships will appear here." />
          )}
        </section>
      </div>

      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Recent</p>
            <h2>Latest Applications</h2>
          </div>
        </div>
        {latestApplications.length ? (
          <div className="admin-feed-list">
            {latestApplications.map((application) => (
              <article key={application.id} className="admin-feed-item">
                <strong>{application.fullName || "Unknown Applicant"}</strong>
                <p>
                  {application.internship?.title || "Internship"} at{" "}
                  {application.internship?.company?.name || "Company"}
                </p>
                <span>{application.status || "Applied"}</span>
              </article>
            ))}
          </div>
        ) : (
          <AdminEmptyState title="No applications yet" description="Submitted applications will appear here." />
        )}
      </section>
    </section>
  );
}

export default AdminDashboardPage;
