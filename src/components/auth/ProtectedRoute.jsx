import { Navigate, Outlet } from "react-router-dom";

import { getDefaultRouteForRole, useAppContext } from "../../context/AppContext";

function ProtectedRoute({ allowedRoles, redirectTo = "/login" }) {
  const { auth, isAuthReady, isAuthenticated } = useAppContext();

  if (!isAuthReady) {
    return (
      <main className="page auth-page">
        <section className="panel">
          <p>Checking access...</p>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!allowedRoles.includes(auth.user?.role)) {
    const target = getDefaultRouteForRole(auth.user?.role);

    return <Navigate to={target} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
