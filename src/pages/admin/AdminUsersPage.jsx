import { useEffect, useState } from "react";

import AdminEmptyState from "../../components/admin/AdminEmptyState";
import AdminLoadingState from "../../components/admin/AdminLoadingState";
import AdminTable from "../../components/admin/AdminTable";
import { adminService } from "../../services";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const loadUsers = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await adminService.getUsers({ search, role });
      setUsers(response.users || []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load users.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    await loadUsers();
  };

  const handleView = async (userId) => {
    setIsDetailsLoading(true);

    try {
      const response = await adminService.getUserDetails(userId);
      setSelectedUser(response.user || null);
    } catch (loadError) {
      setError(loadError.message || "Unable to load user details.");
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    const shouldDelete = window.confirm("Delete this user and linked records?");

    if (!shouldDelete) {
      return;
    }

    try {
      await adminService.deleteUser(userId);
      setUsers((current) => current.filter((user) => user.id !== userId));

      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete user.");
    }
  };

  const rows = users.map((user) => ({
    ...user,
    actions: (
      <div className="admin-table-actions">
        <button type="button" className="button-secondary" onClick={() => handleView(user.id)}>
          View
        </button>
        <button type="button" className="button-ghost" onClick={() => handleDelete(user.id)}>
          Delete
        </button>
      </div>
    )
  }));

  return (
    <section className="admin-page-stack">
      <div className="admin-section-heading">
        <div>
          <p className="eyebrow">Users</p>
          <h2>Manage Platform Accounts</h2>
        </div>
      </div>

      <section className="panel">
        <form className="admin-toolbar" onSubmit={handleSearchSubmit}>
          <label className="form-field">
            <span>Search</span>
            <input
              type="text"
              value={search}
              placeholder="Search by name or email"
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label className="form-field">
            <span>Role</span>
            <select value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="company">Company</option>
              <option value="admin">Admin</option>
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
            <AdminLoadingState label="Loading users..." />
          ) : (
            <AdminTable
              columns={[
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "role", label: "Role" },
                {
                  key: "createdAt",
                  label: "Registered",
                  render: (user) =>
                    user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"
                }
              ]}
              rows={rows}
              emptyState={
                <AdminEmptyState
                  title="No users found"
                  description="Try a different search term or role filter."
                />
              }
            />
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Details</p>
              <h2>User Profile</h2>
            </div>
          </div>
          {isDetailsLoading ? <AdminLoadingState label="Loading user details..." /> : null}
          {!isDetailsLoading && selectedUser ? (
            <div className="admin-detail-card">
              <p><strong>Name:</strong> {selectedUser.name || "N/A"}</p>
              <p><strong>Email:</strong> {selectedUser.email || "N/A"}</p>
              <p><strong>Role:</strong> {selectedUser.role || "N/A"}</p>
              <p><strong>Applications:</strong> {selectedUser.applicationCount ?? 0}</p>
              <p><strong>Internships:</strong> {selectedUser.internshipCount ?? 0}</p>
              <p>
                <strong>Registered:</strong>{" "}
                {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : "N/A"}
              </p>
            </div>
          ) : null}
          {!isDetailsLoading && !selectedUser ? (
            <AdminEmptyState
              title="No user selected"
              description="Choose a user from the list to inspect their details."
            />
          ) : null}
        </section>
      </div>
    </section>
  );
}

export default AdminUsersPage;
