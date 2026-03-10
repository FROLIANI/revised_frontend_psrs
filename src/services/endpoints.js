import http from "@/services/http-common";

class DataService {

  // ════════════════════════════════════════
  //  AUTH
  // ════════════════════════════════════════

  register(data) {
    return http.post("/auth/register", data);
  }

  login(data) {
    return http.post("/auth/login", data);
  }

  logout() {
    return http.post("/auth/logout");
  }

  me() {
    return http.get("/auth/me");
  }

  forgotPassword(data) {
    return http.post("/auth/forgot-password", data);
  }

  resetPassword(data) {
    return http.post("/auth/reset-password", data);
  }

  generateApiKey() {
    return http.post("/auth/generate-api-key");
  }

  // ════════════════════════════════════════
  //  JOBS
  // ════════════════════════════════════════

  getAllJobs() {
    return http.get("/jobs");
  }

  getAllJobsAdmin() {
    return http.get("/admin/jobs");
  }

  getJob(data) {
    return http.get(`/jobs/${data.id}`);
  }

  createJob(data) {
    return http.post("/jobs", data);
  }

  updateJob(data) {
    return http.put(`/jobs/${data.id}`, data);
  }

  deleteJob(data) {
    return http.delete(`/jobs/${data.id}`);
  }

  // ════════════════════════════════════════
  //  APPLICATIONS
  // ════════════════════════════════════════

  getAllApplications() {
    return http.get("/applications");
  }

  getApplication(data) {
    return http.get(`/applications/${data.id}`);
  }

  applyJob(data) {
    return http.post("/apply", data);
  }

  evaluateApplication(data) {
    return http.post(`/applications/${data.id}/evaluate`);
  }

  updateApplicationStatus(data) {
    return http.patch(`/applications/${data.id}/status`, { status: data.status });
  }
}

export default new DataService();