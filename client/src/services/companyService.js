import { apiClient } from "./apiClient";

export const companyService = {
  createInternship(payload) {
    return apiClient.post("/internships", payload);
  },
  updateInternship(internshipId, payload) {
    return apiClient.put(`/internships/${internshipId}`, payload);
  },
  getInternships() {
    return apiClient.get("/company/internships");
  },
  getApplicants(internshipId, query = "") {
    return apiClient.get(`/company/internships/${internshipId}/applicants`, {
      params: query.trim() ? { query: query.trim() } : {}
    });
  },
  updateApplicationStatus(applicationId, status) {
    return apiClient.patch(`/company/applications/${applicationId}/status`, {
      status
    });
  }
};
