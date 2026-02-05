// src/pages/AddDriver.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import busService from "../api/busService";
import driverService from "../api/driverService";
import Navbar from "../Components/Navbar";

const AddDriver = () => {
  const { id: busId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    pickTime: "",
    dropTime: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Please enter driver name");
      return;
    }
    
    if (!formData.contactNumber || formData.contactNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit contact number");
      return;
    }
    
    if (!formData.pickTime || !formData.dropTime) {
      toast.error("Please select both pick and drop times");
      return;
    }

    setLoading(true);

    try {
      // 1. Add Driver
      const driverData = {
        name: formData.name.trim(),
        contactNumber: formData.contactNumber,
        pickTime: formData.pickTime,
        dropTime: formData.dropTime,
      };

      console.log("Sending driver data:", driverData);
      const driverRes = await driverService.addDriver(driverData);
      console.log("Driver Response:", driverRes);

      // Extract driver ID - FIXED: using lowercase 'did' based on your response
      let driverId;
      
      if (driverRes?.data?.did) {
        // Structure: { data: { did: "..." } }
        driverId = driverRes.data.did;
      } else if (driverRes?.data?.data?.did) {
        // Structure: { data: { data: { did: "..." } } }
        driverId = driverRes.data.data.did;
      } else if (driverRes?.data?.dId) {
        // Fallback to camelCase
        driverId = driverRes.data.dId;
      } else if (driverRes?.data?.driverId) {
        // Alternative: driverId
        driverId = driverRes.data.driverId;
      } else if (driverRes?.data?.id) {
        // Alternative: id
        driverId = driverRes.data.id;
      } else {
        // Log for debugging
        console.error("Full response structure:", driverRes);
        console.error("Available keys in data:", Object.keys(driverRes?.data || {}));
        throw new Error(`Driver ID not found in response. Available fields: ${JSON.stringify(driverRes?.data || {})}`);
      }

      if (!driverId) {
        throw new Error("Driver ID is undefined");
      }

      console.log("Extracted Driver ID:", driverId);

      // 2. Assign Driver to Bus
      console.log("Assigning driver", driverId, "to bus", busId);
      await busService.assignDriverToBus(busId, driverId);

      toast.success("Driver added and assigned to bus successfully!");

      // Clear form
      setFormData({
        name: "",
        contactNumber: "",
        pickTime: "",
        dropTime: "",
      });

      // Navigate to add students
      navigate(`/addStudents/${busId}`);
    } catch (err) {
      console.error("Error adding driver:", err);
      
      // More detailed error messages
      if (err.response) {
        // Server responded with error
        console.error("Server error response:", err.response);
        toast.error(err.response.data?.msg || err.response.data?.message || "Server error occurred");
      } else if (err.request) {
        // No response received
        toast.error("No response from server. Please check your connection.");
      } else {
        // Other errors
        toast.error(err.message || "Failed to add driver");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container py-5">
        <div className="row g-5 align-items-center">
          {/* Left Side - Beautiful Driver Image */}
          <div className="col-lg-7 d-none d-lg-block">
            <div className="card border-0 shadow-lg overflow-hidden rounded-4">
              <img
                src="https://img.freepik.com/free-photo/male-bus-driver-portrait_23-2151582603.jpg"
                alt="School Bus Driver"
                className="img-fluid"
                style={{ height: "100%" }}
              />
              <div className="card-img-overlay d-flex align-items-end">
                <div className="bg-dark bg-opacity-70 p-5 rounded w-100 text-white">
                  <h2 className="mb-3 fw-bold">Add a Trusted Driver</h2>
                  <p className="lead mb-0">
                    Ensure safe and reliable transport for our students
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="col-lg-5">
            <div className="card shadow-xl border-0 rounded-4 animate__animated animate__fadeInRight">
              <div className="card-header bg-gradient bg-success text-white text-center py-5">
                <h3 className="mb-2 fw-bold">Add New Driver</h3>
                <p className="mb-0 opacity-90">
                  Bus ID: <strong className="text-warning">{busId}</strong>
                </p>
              </div>

              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    {/* Driver Name */}
                    <div className="col-12">
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-success text-white">
                          <i className="fas fa-user-tie"></i>
                        </span>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          placeholder="Driver Full Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Contact Number */}
                    <div className="col-12">
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-success text-white">
                          <i className="fas fa-phone"></i>
                        </span>
                        <input
                          type="tel"
                          name="contactNumber"
                          className="form-control"
                          placeholder="10-digit Mobile Number"
                          pattern="[0-9]{10}"
                          maxLength="10"
                          value={formData.contactNumber}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Pickup Time */}
                    <div className="col-md-6">
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-success text-white">
                          <i className="fas fa-clock"></i>
                        </span>
                        <input
                          type="time"
                          name="pickTime"
                          className="form-control"
                          value={formData.pickTime}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                        <div className="input-group-text bg-light">Pickup</div>
                      </div>
                    </div>

                    {/* Drop Time */}
                    <div className="col-md-6">
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-success text-white">
                          <i className="fas fa-clock"></i>
                        </span>
                        <input
                          type="time"
                          name="dropTime"
                          className="form-control"
                          value={formData.dropTime}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                        <div className="input-group-text bg-light">Drop</div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-success btn-lg w-100 mt-5 fw-bold shadow-lg hover-lift"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Adding Driver...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-2"></i>
                        Add Driver & Continue to Students
                      </>
                    )}
                  </button>
                </form>

                {/* Info */}
                <div className="mt-4 p-4 bg-info bg-opacity-10 border border-info rounded text-center">
                  <p className="mb-0">
                    <i className="fas fa-info-circle me-2"></i>
                    After adding the driver, you'll be taken to add students to
                    this bus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25) !important;
        }
        
        .hover-lift {
          transition: all 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default AddDriver;