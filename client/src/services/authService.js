import { apiClient } from "./apiClient";

export const authService = {
  login(credentials) {
    return apiClient.post("/auth/login", credentials);
  },
  adminLogin(credentials) {
    return apiClient.post("/auth/admin/login", credentials);
  },
  register(payload) {
    return apiClient.post("/auth/register", payload);
  },
  getCurrentUser() {
    return apiClient.get("/auth/me");
  }
};
