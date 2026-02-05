// src/services/api/studentService.js
import api from "./config";

const studentService = {
  addStudent: async (studentData) => await api.post("/students", studentData),

  getAllStudents: async () => await api.get("/students"),

  getStudentById: async (id) => await api.get(`/students/${id}`),

  getStudentByMobile: async (mobile) => await api.get(`/student/${mobile}`),

  getStudentByName: async (name) => await api.get(`/stu/${name}`),

  updateStudent: async (id, data) => await api.patch(`/students/${id}`, data),

  deleteStudent: async (id) => await api.delete(`/students/${id}`),
};

export default studentService;