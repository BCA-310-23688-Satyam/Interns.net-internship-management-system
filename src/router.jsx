import { createBrowserRouter } from "react-router-dom";

import GuestRoute from "./components/auth/GuestRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import MainLayout from "./components/layout/MainLayout";
import AdminApplicationsPage from "./pages/admin/AdminApplicationsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminInternshipsPage from "./pages/admin/AdminInternshipsPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import DashboardPage from "./pages/DashboardPage";
import CompaniesPage from "./pages/CompaniesPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentsPage from "./pages/StudentsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "dashboard",
        element: <DashboardPage />
      },
      {
        path: "companies",
        element: <ProtectedRoute allowedRoles={["company"]} />,
        children: [
          {
            index: true,
            element: <CompaniesPage />
          }
        ]
      },
      {
        element: <GuestRoute />,
        children: [
          {
            path: "login",
            element: <LoginPage />
          },
          {
            path: "register",
            element: <RegisterPage />
          }
        ]
      },
      {
        path: "students",
        element: <ProtectedRoute allowedRoles={["student"]} />,
        children: [
          {
            index: true,
            element: <StudentsPage />
          }
        ]
      }
    ]
  },
  {
    path: "/admin",
    children: [
      {
        element: <GuestRoute />,
        children: [
          {
            path: "login",
            element: <AdminLoginPage />
          }
        ]
      },
      {
        element: <ProtectedRoute allowedRoles={["admin"]} redirectTo="/admin/login" />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                path: "dashboard",
                element: <AdminDashboardPage />
              },
              {
                path: "users",
                element: <AdminUsersPage />
              },
              {
                path: "internships",
                element: <AdminInternshipsPage />
              },
              {
                path: "applications",
                element: <AdminApplicationsPage />
              }
            ]
          }
        ]
      }
    ]
  }
]);
