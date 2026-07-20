import { apiClient } from "./apiClient";

export const dashboardService = {
  getStats() {
    return apiClient.get("/stats");
  },
  getInternships() {
    return apiClient.get("/internships");
  },
  getApplications() {
    return apiClient.get("/stats/recent-applications");
  }
};
