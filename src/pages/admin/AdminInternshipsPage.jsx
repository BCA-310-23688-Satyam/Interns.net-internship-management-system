import { useEffect, useState } from "react";

import AdminEmptyState from "../../components/admin/AdminEmptyState";
import AdminLoadingState from "../../components/admin/AdminLoadingState";
import AdminTable from "../../components/admin/AdminTable";
import { adminService } from "../../services";

const initialForm = {
  title: "",
  description: "",
  duration: "",
  requiredSkills: "",
  approvalStatus: "approved"
};

function AdminInternshipsPage() {
  const [internships, setInternships] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [formValues, setFormValues] = useState(initialForm);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadInternships = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await adminService.getInternships({ search, status });
      setInternships(response.internships || []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load internships.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInternships();
  }, []);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    await loadInternships();
  };

  const handleEditSelect = (internship) => {
    setSelectedInternship(internship);
    setFormValues({
      title: internship.title || "",
      description: internship.description || "",
      duration: internship.duration || "",
      requiredSkills: internship.requiredSkills || "",
      approvalStatus: internship.approvalStatus || "approved"
    });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!selectedInternship?.id) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await adminService.updateInternship(selectedInternship.id, formValues);
      const updatedInternship = response.internship;

      setInternships((current) =>
        current.map((internship) =>
          internship.id === selectedInternship.id ? updatedInternship : internship
        )
      );
      setSelectedInternship(updatedInternship);
      setFormValues({
        title: updatedInternship.title || "",
        description: updatedInternship.description || "",
        duration: updatedInternship.duration || "",
        requiredSkills: updatedInternship.requiredSkills || "",
        approvalStatus: updatedInternship.approvalStatus || "approved"
      });
    } catch (saveError) {
      setError(saveError.message || "Unable to update internship.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (internshipId) => {
    const shouldDelete = window.confirm("Delete this internship and all linked applications?");

    if (!shouldDelete) {
      return;
    }

    try {
      await adminService.deleteInternship(internshipId);
      setInternships((current) => current.filter((internship) => internship.id !== internshipId));

      if (selectedInternship?.id === internshipId) {
        setSelectedInternship(null);
        setFormValues(initialForm);
      }
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete internship.");
    }
  };

  const rows = internships.map((internship) => ({
    ...internship,
    actions: (
      <div className="admin-table-actions">
        <button type="button" className="button-secondary" onClick={() => handleEditSelect(internship)}>
          Edit
        </button>
        <button type="button" className="button-ghost" onClick={() => handleDelete(internship.id)}>
          Delete
        </button>
      </div>
    )
  }));

  return (
    <section className="admin-page-stack">
      <div className="admin-section-heading">
        <div>
          <p className="eyebrow">Internships</p>
          <h2>Manage Internship Listings</h2>
        </div>
      </div>

      <section className="panel">
        <form className="admin-toolbar" onSubmit={handleSearchSubmit}>
          <label className="form-field">
            <span>Search</span>
            <input
              type="text"
              value={search}
              placeholder="Search by title or skills"
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label className="form-field">
            <span>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <button type="submit" className="button-primary admin-toolbar-button">
            Apply
          </button>
        </form>
      </section>

      {error ? <p className="notice notice-error">{error}</p> : null}

      <div className="admin-grid-two">
        <section className="panel">
          {isLoading ? (
            <AdminLoadingState label="Loading internships..." />
          ) : (
            <AdminTable
              columns={[
                { key: "title", label: "Title" },
                {
                  key: "company",
                  label: "Company",
                  render: (internship) => internship.company?.name || "N/A"
                },
                { key: "duration", label: "Duration" },
                { key: "requiredSkills", label: "Skills" },
                {
                  key: "createdAt",
                  label: "Posted",
                  render: (internship) =>
                    internship.createdAt ? new Date(internship.createdAt).toLocaleDateString() : "N/A"
                }
              ]}
              rows={rows}
              emptyState={
                <AdminEmptyState
                  title="No internships found"
                  description="Try a different filter or wait for companies to post openings."
                />
              }
            />
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Editor</p>
              <h2>Update Internship</h2>
            </div>
          </div>
          {selectedInternship ? (
            <form className="auth-form" onSubmit={handleSave}>
              <label className="form-field">
                <span>Title</span>
                <input name="title" value={formValues.title} onChange={handleFormChange} />
              </label>
              <label className="form-field">
                <span>Description</span>
                <textarea
                  name="description"
                  rows="4"
                  value={formValues.description}
                  onChange={handleFormChange}
                />
              </label>
              <label className="form-field">
                <span>Duration</span>
                <input name="duration" value={formValues.duration} onChange={handleFormChange} />
              </label>
              <label className="form-field">
                <span>Required Skills</span>
                <input
                  name="requiredSkills"
                  value={formValues.requiredSkills}
                  onChange={handleFormChange}
                />
              </label>
              <label className="form-field">
                <span>Approval Status</span>
                <select
                  name="approvalStatus"
                  value={formValues.approvalStatus}
                  onChange={handleFormChange}
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </label>
              <button type="submit" className="button-primary" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          ) : (
            <AdminEmptyState
              title="No internship selected"
              description="Choose an internship from the list to edit or review its approval status."
            />
          )}
        </section>
      </div>
    </section>
  );
}

export default AdminInternshipsPage;
