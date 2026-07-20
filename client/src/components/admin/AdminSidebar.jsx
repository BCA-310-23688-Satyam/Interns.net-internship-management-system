import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Users", to: "/admin/users" },
  { label: "Internships", to: "/admin/internships" },
  { label: "Applications", to: "/admin/applications" }
];

function AdminSidebar({ isOpen, onClose, onLogout, user }) {
  return (
    <>
      <button
        type="button"
        className={`admin-overlay${isOpen ? " is-visible" : ""}`}
        aria-label="Close admin navigation"
        onClick={onClose}
      />
      <aside className={`admin-sidebar${isOpen ? " is-open" : ""}`}>
        <div className="admin-sidebar-top">
          <div className="admin-brand">
            <span className="admin-brand-badge">ADM</span>
            <div>
              <strong>Interns.NET</strong>
              <p>Admin Panel</p>
            </div>
          </div>

          <div className="admin-user-card">
            <span>{user?.name || "Admin User"}</span>
            <small>{user?.email || "admin@example.com"}</small>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `admin-nav-link${isActive ? " is-active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="button-ghost admin-logout" onClick={onLogout}>
          Logout
        </button>
      </aside>
    </>
  );
}

export default AdminSidebar;
