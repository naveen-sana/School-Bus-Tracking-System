// src/pages/AddBus.js
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import config from "../api/config";
import Navbar from "../Components/Navbar";

const AddBus = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    number: "",
    route: "",
    location: "School",
    status: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate bus number format
    if (!form.number.trim()) {
      toast.error("Please enter bus number");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await config.post("/bus", form);
      
      if (response.status === 201 || response.status === 200) {
        toast.success("Bus added successfully!");
        setForm({ number: "", route: "", location: "School", status: false });
        
        // Redirect after success
        setTimeout(() => {
          navigate("/viewBus");
        }, 1500);
      }
    } catch (err) {
      console.error("Error adding bus:", err);
      toast.error(err.response?.data?.message || "Failed to add bus. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-primary text-white py-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h2 className="mb-0">
                      <i className="fas fa-bus me-2"></i>
                      Add New Bus
                    </h2>
                    <p className="mb-0 opacity-75">Register a new school bus</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-light btn-sm"
                    onClick={() => navigate("/viewBus")}
                  >
                    <i className="fas fa-arrow-left me-1"></i> Back
                  </button>
                </div>
              </div>
              
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="fas fa-hashtag me-2 text-primary"></i>
                      Bus Number *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-bus"></i>
                      </span>
                      <input
                        type="text"
                        name="number"
                        className="form-control form-control-lg"
                        placeholder="Enter bus number (e.g., BUS-001, SB-2024)"
                        value={form.number}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <small className="text-muted">Enter a unique bus identification number</small>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="fas fa-route me-2 text-primary"></i>
                      Route Details
                    </label>
                    <textarea
                      name="route"
                      className="form-control"
                      placeholder="Enter bus route details, pickup points, drop points, etc."
                      value={form.route}
                      onChange={handleChange}
                      rows="3"
                    />
                    <small className="text-muted">Describe the bus route and stops</small>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                      Current Location
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-location-dot"></i>
                      </span>
                      <select
                        name="location"
                        className="form-select"
                        value={form.location}
                        onChange={handleChange}
                      >
                        <option value="School">School Premises</option>
                        <option value="Depot">Bus Depot</option>
                        <option value="Main Gate">Main Gate</option>
                        <option value="On Route">On Route</option>
                        <option value="Not Available">Not Available</option>
                      </select>
                    </div>
                    <small className="text-muted">Initial location of the bus</small>
                  </div>
                  
                  <div className="mb-4">
                    <div className="form-check form-switch">
                      <input
                        type="checkbox"
                        name="status"
                        className="form-check-input"
                        id="statusSwitch"
                        checked={form.status}
                        onChange={handleChange}
                        style={{transform: "scale(1.2)"}}
                      />
                      <label className="form-check-label fw-semibold" htmlFor="statusSwitch">
                        <i className="fas fa-play-circle me-2"></i>
                        Mark as Running
                      </label>
                      <small className="form-text text-muted d-block mt-1">
                        {form.status ? 
                          "Bus will be active and can start trips immediately" : 
                          "Bus will be inactive until manually started"}
                      </small>
                    </div>
                  </div>
                  
                  <div className="d-grid gap-3 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg py-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Adding Bus...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plus-circle me-2"></i>
                          Add Bus to System
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-lg"
                      onClick={() => navigate("/viewBus")}
                    >
                      <i className="fas fa-eye me-2"></i>
                      View All Buses
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="card-footer bg-light py-3">
                <div className="row text-center">
                  <div className="col-md-6 mb-2 mb-md-0">
                    <small className="text-muted">
                      <i className="fas fa-info-circle me-1"></i>
                      All fields marked with * are required
                    </small>
                  </div>
                  <div className="col-md-6">
                    <small className="text-muted">
                      <i className="fas fa-clock me-1"></i>
                      Bus will be available immediately after adding
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBus;