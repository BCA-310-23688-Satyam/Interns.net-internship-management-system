import { Outlet } from "react-router-dom";

import Header from "./Header";

function MainLayout() {
  return (
    <div className="site-shell">
      <div className="site-backdrop" aria-hidden="true" />
      <Header />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
