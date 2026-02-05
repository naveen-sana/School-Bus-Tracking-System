import React, { useEffect, useState } from "react";
import { connectWebSocket, disconnectWebSocket } from "../services/websocket/socketClient";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const ViewLocation = () => {
  const [location, setLocation] = useState("Connecting to bus...");
  const [status, setStatus] = useState("connecting");
  const [lastSeen, setLastSeen] = useState(null);

  const busNumber = localStorage.getItem("busNumber");

  useEffect(() => {
    if (!busNumber) {
      setLocation("No bus assigned to your child");
      setStatus("offline");
      toast.error("Please login again");
      return;
    }

    toast.info(`Tracking Bus ${busNumber}...`, { autoClose: false, toastId: "tracking" });

    connectWebSocket(busNumber, (data) => {
      setLocation(data.location || "Location not available");
      setStatus(data.status ? "online" : "stopped");
      setLastSeen(new Date().toLocaleTimeString());
      toast.update("tracking", {
        render: `Bus ${busNumber} is live!`,
        type: "success",
        autoClose: 3000,
      });
    });

    return () => {
      disconnectWebSocket();
      toast.dismiss("tracking");
    };
  }, [busNumber]);

  return (
    <div className="min-vh-100 bg-gradient" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      <Navbar />

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow-lg border-0 overflow-hidden">
              {/* Header */}
              <div className="card-header bg-primary text-white text-center py-5">
                <h1 className="mb-3 display-5 fw-bold">
                  Live Bus Location
                </h1>
                <h3 className="mb-0">
                  Bus Number: <strong className="text-warning">{busNumber || "Not Assigned"}</strong>
                </h3>
              </div>

              <div className="card-body p-5 text-center">
                {/* Status Indicator */}
                <div className="mb-4">
                  <div className={`badge fs-4 px-5 py-3 bg-${status === "online" ? "success" : status === "stopped" ? "warning" : "secondary"}`}>
                    {status === "online" ? "Running" : status === "stopped" ? "Stopped" : "Offline"}
                  </div>
                  {lastSeen && (
                    <p className="text-muted mt-2">
                      Last update: {lastSeen}
                    </p>
                  )}
                </div>

                {/* Location Display */}
                <div className="p-5 bg-light rounded-4 shadow-sm">
                  <i className="fas fa-bus fa-4x text-primary mb-4"></i>
                  <h2 className="mb-3">Current Location</h2>
                  <h1 className={`display-4 fw-bold ${status === "online" ? "text-success" : "text-danger"}`}>
                    {location}
                  </h1>
                </div>

                {/* Google Map (if coordinates) */}
                {location && location.includes(",") && !isNaN(location.split(",")[0]) && (
                  <div className="mt-5 ratio ratio-16x9 rounded overflow-hidden shadow-lg">
                    <iframe
                      title="Live Bus on Map"
                      src={`https://maps.google.com/maps?q=${location}&z=15&output=embed`}
                      width="100%"
                      height="400"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                    ></iframe>
                  </div>
                )}

                {/* Info */}
                <div className="mt-5 p-4 bg-info bg-opacity-10 rounded border border-info">
                  <p className="mb-0 text-center lead">
                    <i className="fas fa-info-circle me-2"></i>
                    This location updates in real-time when the driver has location ON.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLocation;