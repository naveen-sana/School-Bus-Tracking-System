// src/pages/ParentHome.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import busService from "../api/busService";
import Navbar from "../Components/Navbar";

const ParentHome = () => {
  const navigate = useNavigate();
  const [busNumber, setBusNumber] = useState("Not Assigned");
  const [busDetails, setBusDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [childName, setChildName] = useState("Your Child");

  useEffect(() => {
    const storedChildName = localStorage.getItem("studentName");
    const storedBusNumber = localStorage.getItem("busNumber");

    if (storedChildName) setChildName(storedChildName);
    if (storedBusNumber) setBusNumber(storedBusNumber);

    const fetchBusDetails = async () => {
      if (!storedBusNumber) {
        setLoading(false);
        return;
      }

      try {
        const response = await busService.getBusByNumber(storedBusNumber);
        setBusDetails(response.data);
      } catch (err) {
        console.log("API failed, using fallback");
      } finally {
        setLoading(false);
      }
    };

    fetchBusDetails();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out successfully");
    navigate("/parentLogin");
  };

  const getStatusInfo = () => {
    if (!busDetails?.status) return { color: "secondary", text: "Unknown" };
    return busDetails.status
      ? { color: "success", text: "Running" }
      : { color: "danger", text: "Stopped" };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />

      <div className="container py-5">
        {/* Welcome Header */}
        <div className="card border-0 shadow-sm bg-primary text-white mb-4">
          <div className="card-body p-4">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h1 className="display-6 fw-bold mb-2">Welcome, Parent!</h1>
                <p className="lead mb-0">
                  Track your child's school bus safely in real-time
                </p>
              </div>
              <div className="col-md-4 text-md-end">
                <div className="bg-white text-dark rounded-pill px-4 py-2 d-inline-block">
                  <strong>{childName}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bus Info */}
        <div className="card shadow-lg border-0 mb-4">
          <div className="card-header bg-white py-3">
            <h4 className="mb-0">Bus Information</h4>
          </div>
          <div className="card-body p-4">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" />
                <p className="mt-3">Loading bus details...</p>
              </div>
            ) : busDetails || busNumber !== "Not Assigned" ? (
              <div className="row">
                <div className="col-md-6">
                  <div className="bg-light p-4 rounded">
                    <h5 className="text-primary mb-3">Details</h5>
                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <strong>Bus Number:</strong> {busNumber}
                      </li>
                      <li className="mb-3">
                        <strong>Route:</strong>{" "}
                        {busDetails?.route || "Not specified"}
                      </li>
                      <li>
                        <strong>Last Location:</strong>{" "}
                        {busDetails?.location || "Not available"}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-light p-4 rounded text-center h-100 d-flex flex-column justify-content-center">
                    <h5 className="text-primary mb-3">Status</h5>
                    <span className={`badge bg-${statusInfo.color} fs-4 px-4 py-3`}>
                      {statusInfo.text}
                    </span>
                    <div className="mt-4">
                      <Link
                        to="/liveLocation"
                        className={`btn btn-lg ${
                          statusInfo.text === "Running" ? "btn-success" : "btn-secondary"
                        }`}
                      >
                        View Live Map
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-5">
                <h4>No Bus Assigned</h4>
                <p>Contact school administration for bus assignment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <h3 className="mb-4">Quick Actions</h3>
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card shadow hover-lift h-100">
              <div className="card-body text-center p-5">
                <div className="bg-success bg-opacity-10 rounded-circle p-4 d-inline-block mb-4">
                  <i className="fas fa-map-marked-alt fa-3x text-success"></i>
                </div>
                <h4>Live Tracking</h4>
                <p className="text-muted">
                  View real-time location of your child's bus
                </p>
                <Link to="/liveLocation" className="btn btn-success btn-lg">
                  Start Tracking
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card shadow hover-lift h-100">
              <div className="card-body text-center p-5">
                <div className="bg-warning bg-opacity-10 rounded-circle p-4 d-inline-block mb-4">
                  <i className="fas fa-exclamation-triangle fa-3x text-warning"></i>
                </div>
                <h4>Raise Complaint</h4>
                <p className="text-muted">
                  Report any issues with the bus service
                </p>
                <Link to="/complaint" className="btn btn-warning btn-lg">
                  Submit Complaint
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

export default ParentHome;