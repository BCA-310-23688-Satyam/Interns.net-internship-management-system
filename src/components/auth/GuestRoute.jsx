import { Navigate, Outlet } from "react-router-dom";

import { getDefaultRouteForRole, useAppContext } from "../../context/AppContext";

function GuestRoute() {
  const { auth, isAuthReady, isAuthenticated } = useAppContext();

  if (!isAuthReady) {
    return (
      <main className="page auth-page">
        <section className="panel">
          <p>Loading session...</p>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Outlet />;
  }

  const target = getDefaultRouteForRole(auth.user?.role);

  return <Navigate to={target} replace />;
}

export default GuestRoute;
