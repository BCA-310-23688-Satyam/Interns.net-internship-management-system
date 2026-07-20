function AdminHeader({ onMenuClick, onLogout, user }) {
  return (
    <header className="admin-header">
      <div>
        <p className="eyebrow">Administration</p>
        <h1>Control Center</h1>
      </div>

      <div className="admin-header-actions">
        <div className="admin-user-inline">
          <strong>{user?.name || "Admin"}</strong>
          <small>{user?.role || "admin"}</small>
        </div>
        <button type="button" className="button-secondary admin-menu-button" onClick={onMenuClick}>
          Menu
        </button>
        <button type="button" className="button-ghost" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
