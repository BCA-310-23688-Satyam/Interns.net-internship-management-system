import { apiClient } from "./apiClient";

export const studentService = {
  getInternships() {
    return apiClient.get("/student/internships");
  },
  searchInternships(query) {
    return apiClient.get("/student/internships/search", {
      params: { query }
    });
  },
  applyToInternship(internshipId, payload) {
    return apiClient.post(`/student/internships/${internshipId}/apply`, payload);
  },
  getApplications() {
    return apiClient.get("/student/applications");
  }
};
