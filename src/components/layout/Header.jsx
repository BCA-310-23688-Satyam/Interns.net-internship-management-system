import { NavLink, useNavigate } from "react-router-dom";

import { useAppContext } from "../../context/AppContext";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Login/Register", to: "/login" }
];

function Header() {
  const navigate = useNavigate();
  const { auth, clearAuth, isAuthenticated } = useAppContext();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <header className="site-header">
      <div className="page site-header-inner">
        <NavLink className="brand-mark" to="/">
          <span className="brand-badge">I.NET</span>
          <span>Interns.NET</span>
        </NavLink>

        <div className="header-actions">
          <nav className="site-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
          </nav>

          {isAuthenticated ? (
            <div className="auth-chip-wrap">
              <div className="auth-chip">
                <span>{auth.user?.name}</span>
                <small>{auth.user?.role}</small>
              </div>
              <button type="button" className="button-ghost" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Header;
