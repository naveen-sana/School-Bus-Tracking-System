// src/pages/ViewBus.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import busService from "../api/busService";
import Navbar from "./Navbar";

const ViewBus = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "running", "stopped"

  const fetchBuses = async () => {
    try {
      const res = await busService.getAllBuses();
      setBuses(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load buses");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const filteredBuses = buses.filter((bus) => {
    if (filter === "running") return bus.status;
    if (filter === "stopped") return !bus.status;
    return true;
  });

  const handleSelectBus = (busNumber) => {
    localStorage.setItem("busNumber", busNumber);
    toast.success(`Selected Bus: ${busNumber}`);
  };

  const handleUpdateLocation = (busId, busNumber) => {
    localStorage.setItem("busNumber", busNumber);
    navigate(`/updateLocation/${busId}`);
  };

  const handleAddDriver = (busId) => {
    navigate(`/addDriver/${busId}`);
  };

  const getStatusBadge = (status) => {
    return status ? (
      <span className="badge bg-success rounded-pill px-3 py-2">
        <i className="fas fa-play-circle me-1"></i> Running
      </span>
    ) : (
      <span className="badge bg-secondary rounded-pill px-3 py-2">
        <i className="fas fa-stop-circle me-1"></i> Stopped
      </span>
    );
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />

      <div className="container py-5">
        {/* Header */}
        <div className="row mb-4">
          <div className="col">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="display-6 fw-bold text-primary">
                <i className="fas fa-bus me-3"></i>
                Bus Management
              </h1>
              <Link to="/addBus" className="btn btn-primary btn-lg">
                <i className="fas fa-plus-circle me-2"></i>
                Add New Bus
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="row mb-4">
          <div className="col">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <h5 className="mb-0">Filter Buses</h5>
                  </div>
                  <div className="col-md-6">
                    <div className="btn-group w-100" role="group">
                      <button
                        type="button"
                        className={`btn ${
                          filter === "all"
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => setFilter("all")}
                      >
                        All ({buses.length})
                      </button>
                      <button
                        type="button"
                        className={`btn ${
                          filter === "running"
                            ? "btn-success"
                            : "btn-outline-success"
                        }`}
                        onClick={() => setFilter("running")}
                      >
                        Running ({buses.filter((b) => b.status).length})
                      </button>
                      <button
                        type="button"
                        className={`btn ${
                          filter === "stopped"
                            ? "btn-secondary"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() => setFilter("stopped")}
                      >
                        Stopped ({buses.filter((b) => !b.status).length})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buses Table */}
        <div className="row">
          <div className="col">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-white border-0 pt-4">
                <h4 className="card-title mb-0">
                  <i className="fas fa-list-alt me-2 text-primary"></i>
                  All Buses ({filteredBuses.length})
                </h4>
              </div>

              <div className="card-body p-0">
                {loading ? (
                  <div className="text-center py-5">
                    <div
                      className="spinner-border text-primary"
                      style={{ width: "3rem", height: "3rem" }}
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading buses...</p>
                  </div>
                ) : filteredBuses.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-bus-slash fa-4x text-muted mb-4"></i>
                    <h4 className="text-muted">No buses found</h4>
                    <p className="text-muted mb-4">
                      Try changing your filter or add a new bus
                    </p>
                    <Link to="/addBus" className="btn btn-primary">
                      <i className="fas fa-plus-circle me-2"></i>
                      Add Your First Bus
                    </Link>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="text-center">#</th>
                          <th>Bus Details</th>
                          <th>Route</th>
                          <th>Location</th>
                          <th>Status</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBuses.map((bus, index) => (
                          <tr key={bus.id} className="border-bottom">
                            <td className="text-center fw-bold">{index + 1}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div
                                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                  style={{ width: "50px", height: "50px" }}
                                >
                                  <i className="fas fa-bus fa-lg"></i>
                                </div>
                                <div>
                                  <h6 className="mb-0">{bus.number}</h6>
                                  <small className="text-muted">
                                    ID: {bus.id}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div
                                className="text-truncate"
                                style={{ maxWidth: "200px" }}
                              >
                                {bus.route || (
                                  <span className="text-muted">
                                    Not specified
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <i className="fas fa-map-marker-alt text-danger me-2"></i>
                                <span>{bus.location || "Unknown"}</span>
                              </div>
                            </td>
                            <td>{getStatusBadge(bus.status)}</td>
                            <td className="text-center">
                              <div className="btn-group" role="group">
                                <button
                                  className="btn btn-outline-success btn-sm"
                                  onClick={() =>
                                    navigate(`/addDriver/${bus.id}`)
                                  }
                                  title="Add Driver"
                                >
                                  <i className="fas fa-user-plus"></i>
                                </button>
                                <button
                                  className="btn btn-outline-info btn-sm"
                                  onClick={() =>
                                    navigate(`/addStudents/${bus.id}`)
                                  }
                                  title="Add Students"
                                >
                                  <i className="fas fa-users"></i>
                                </button>
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() =>
                                    handleUpdateLocation(bus.id, bus.number)
                                  }
                                  title="Update Location"
                                >
                                  <i className="fas fa-location-arrow"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="card-footer bg-white border-0 py-4">
                <div className="row text-center">
                  <div className="col-md-3 mb-3 mb-md-0">
                    <div className="card bg-primary text-white">
                      <div className="card-body py-3">
                        <h5 className="card-title mb-0">Total Buses</h5>
                        <p className="card-text display-6 fw-bold">
                          {buses.length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3 mb-md-0">
                    <div className="card bg-success text-white">
                      <div className="card-body py-3">
                        <h5 className="card-title mb-0">Running</h5>
                        <p className="card-text display-6 fw-bold">
                          {buses.filter((b) => b.status).length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3 mb-md-0">
                    <div className="card bg-secondary text-white">
                      <div className="card-body py-3">
                        <h5 className="card-title mb-0">Stopped</h5>
                        <p className="card-text display-6 fw-bold">
                          {buses.filter((b) => !b.status).length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card bg-info text-white">
                      <div className="card-body py-3">
                        <h5 className="card-title mb-0">With Driver</h5>
                        <p className="card-text display-6 fw-bold">
                          {buses.filter((b) => b.driver).length}
                        </p>
                      </div>
                    </div>
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

export default ViewBus;
