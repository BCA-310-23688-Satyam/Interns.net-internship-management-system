import { apiClient } from "./apiClient";

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && `${value}`.trim() !== "") {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export const adminService = {
  getDashboard() {
    return apiClient.get("/admin/dashboard");
  },
  getUsers(params) {
    return apiClient.get(`/admin/users${buildQuery(params)}`);
  },
  getUserDetails(id) {
    return apiClient.get(`/admin/users/${id}`);
  },
  deleteUser(id) {
    return apiClient.delete(`/admin/users/${id}`);
  },
  getInternships(params) {
    return apiClient.get(`/admin/internships${buildQuery(params)}`);
  },
  updateInternship(id, payload) {
    return apiClient.put(`/admin/internships/${id}`, payload);
  },
  deleteInternship(id) {
    return apiClient.delete(`/admin/internships/${id}`);
  },
  getApplications(params) {
    return apiClient.get(`/admin/applications${buildQuery(params)}`);
  },
  deleteApplication(id) {
    return apiClient.delete(`/admin/applications/${id}`);
  }
};
