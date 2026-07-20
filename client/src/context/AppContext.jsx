import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  AUTH_STORAGE_EVENT,
  clearStoredAuth,
  getStoredAuth,
  setStoredAuth
} from "../lib/authStorage";
import { authService } from "../services";

const AppContext = createContext(null);

const initialHighlights = [
  "Student-first applications",
  "Simple hiring workflows",
  "Clear internship visibility"
];

export function getDefaultRouteForRole(role) {
  if (role === "admin") {
    return "/admin/dashboard";
  }

  if (role === "company") {
    return "/companies";
  }

  return "/students";
}

export function AppProvider({ children }) {
  const [highlights] = useState(initialHighlights);
  const [auth, setAuth] = useState({
    token: "",
    user: null
  });
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const restoreAuth = async () => {
      const storedAuth = getStoredAuth();

      if (!storedAuth.token) {
        if (isMounted) {
          setAuth(storedAuth);
          setIsAuthReady(true);
        }

        return;
      }

      try {
        const response = await authService.getCurrentUser();

        if (!isMounted) {
          return;
        }

        const nextAuth = {
          token: storedAuth.token,
          user: response.user
        };

        setAuth(nextAuth);
        setStoredAuth(nextAuth);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setAuth({
          token: "",
          user: null
        });
        clearStoredAuth();
      } finally {
        if (isMounted) {
          setIsAuthReady(true);
        }
      }
    };

    restoreAuth();

    const syncAuth = () => {
      if (!isMounted) {
        return;
      }

      setAuth(getStoredAuth());
    };

    window.addEventListener(AUTH_STORAGE_EVENT, syncAuth);

    return () => {
      isMounted = false;
      window.removeEventListener(AUTH_STORAGE_EVENT, syncAuth);
    };
  }, []);

  const saveAuth = ({ token, user }) => {
    const nextAuth = { token, user };

    setAuth(nextAuth);
    setStoredAuth(nextAuth);
  };

  const clearAuth = () => {
    setAuth({
      token: "",
      user: null
    });
    clearStoredAuth();
  };

  const value = useMemo(
    () => ({
      auth,
      clearAuth,
      highlights,
      isAuthReady,
      isAuthenticated: Boolean(auth.token && auth.user),
      saveAuth
    }),
    [auth, highlights, isAuthReady]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
}
