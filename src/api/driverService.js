import api from "./config";

const driverService = {

  loginDriver: async (loginData) => {
    const params = new URLSearchParams();
    params.append('busNumber', loginData.busNumber);
    params.append('mobileNumber', loginData.mobileNumber);
    
    return await api.post("/login/driver", params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },

  addDriver: async (driverData) => await api.post("/driver", driverData),

  getAllDrivers: async () => await api.get("/driver"),

  getDriverById: async (id) => await api.get(`/driver/${id}`),

  getBusByNumber: async (busNumber) => {
    return await api.get(`/buses/${busNumber}`);
  },

  updateBusLocation: async (locationData) => {
    return await api.post("/bus/location", locationData);
  },

  updateDriver: async (id, data) => await api.patch(`/driver/${id}`, data),

  deleteDriver: async (id) => await api.delete(`/driver/${id}`),
};

export default driverService;
