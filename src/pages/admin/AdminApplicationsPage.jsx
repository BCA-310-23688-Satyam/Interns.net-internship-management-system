import { useEffect, useState } from "react";

import AdminEmptyState from "../../components/admin/AdminEmptyState";
import AdminLoadingState from "../../components/admin/AdminLoadingState";
import AdminTable from "../../components/admin/AdminTable";
import { adminService } from "../../services";

function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadApplications = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await adminService.getApplications({ search });
      setApplications(response.applications || []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load applications.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    await loadApplications();
  };

  const handleDelete = async (applicationId) => {
    const shouldDelete = window.confirm("Delete this application?");

    if (!shouldDelete) {
      return;
    }

    try {
      await adminService.deleteApplication(applicationId);
      setApplications((current) => current.filter((application) => application.id !== applicationId));
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete application.");
    }
  };

  const rows = applications.map((application) => ({
    ...application,
    actions: (
      <div className="admin-table-actions">
        <button type="button" className="button-ghost" onClick={() => handleDelete(application.id)}>
          Delete
        </button>
      </div>
    )
  }));

  return (
    <section className="admin-page-stack">
      <div className="admin-section-heading">
        <div>
          <p className="eyebrow">Applications</p>
          <h2>Manage Submitted Applications</h2>
        </div>
      </div>

      <section className="panel">
        <form className="admin-toolbar" onSubmit={handleSearchSubmit}>
          <label className="form-field">
            <span>Search</span>
            <input
              type="text"
              value={search}
              placeholder="Search applicants, internships, or companies"
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <button type="submit" className="button-primary admin-toolbar-button">
            Search
          </button>
        </form>
      </section>

      {error ? <p className="notice notice-error">{error}</p> : null}

      <section className="panel">
        {isLoading ? (
          <AdminLoadingState label="Loading applications..." />
        ) : (
          <AdminTable
            columns={[
              { key: "fullName", label: "Student Name" },
              { key: "email", label: "Email" },
              { key: "currentCourse", label: "Current Course" },
              { key: "desiredRole", label: "Desired Role" },
              {
                key: "internship",
                label: "Internship",
                render: (application) => application.internship?.title || "N/A"
              },
              {
                key: "company",
                label: "Company",
                render: (application) => application.internship?.company?.name || "N/A"
              },
              {
                key: "createdAt",
                label: "Applied",
                render: (application) =>
                  application.createdAt ? new Date(application.createdAt).toLocaleDateString() : "N/A"
              }
            ]}
            rows={rows}
            emptyState={
              <AdminEmptyState
                title="No applications found"
                description="Application records matching your search will appear here."
              />
            }
          />
        )}
      </section>
    </section>
  );
}

export default AdminApplicationsPage;
