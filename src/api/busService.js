// src/services/api/busService.js
import api from "./config";

const busService = {
  getAllBuses: async () => await api.get("/buses"),
  
  getBusById: async (id) => await api.get(`/bus/${id}`),
  
  getBusByNumber: async (number) => await api.get(`/bus/get/${number}`),
  
  addBus: async (busData) => await api.post("/bus", busData),
  
  updateBus: async (id, busData) => await api.patch(`/bus/${id}`, busData),
  
  deleteBus: async (id) => await api.delete(`/bus/${id}`),

  assignDriverToBus: async (busId, driverId) => {
    // This matches your backend: POST /api/v1/addDriver/{busId}/{driverId}
    return await api.post(`/addDriver/${busId}/${driverId}`);
  },

  // Bonus: also fix assignStudentToBus to match your backend pattern
  assignStudentToBus: async (busId, studentId) => {
    return await api.post(`/addStudent/${busId}/${studentId}`);
  },

  // Update live location (for driver)
  updateBusLocation: async (locationData) =>
    await api.post("/bus/location", locationData),
};

export default busService;