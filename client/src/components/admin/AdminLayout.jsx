import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAppContext } from "../../context/AppContext";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  const navigate = useNavigate();
  const { auth, clearAuth } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-shell">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={auth.user}
        onLogout={handleLogout}
      />

      <div className="admin-main">
        <AdminHeader
          user={auth.user}
          onMenuClick={() => setIsSidebarOpen((current) => !current)}
          onLogout={handleLogout}
        />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
