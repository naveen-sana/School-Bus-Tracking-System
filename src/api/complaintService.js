// src/services/api/complaintService.js
import api from "./config";

const complaintService = {
  submitComplaint: async (complaintData) => await api.post("/queries", complaintData),

  getAllComplaints: async () => await api.get("/queries"),

  getComplaintByStudentName: async (studentName) => await api.get(`/get/queries/${studentName}`),

  getComplaintById: async (id) => await api.get(`/queries/${id}`),

  updateComplaint: async (id, data) => await api.patch(`/queries/${id}`, data),

  deleteComplaint: async (id) => await api.delete(`/queries/${id}`),
};

export default complaintService;