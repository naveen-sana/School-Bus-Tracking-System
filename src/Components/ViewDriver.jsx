import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import busService from "../api/busService";
import Navbar from "./Navbar";

const ViewDriver = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllBuses = async () => {
    try {
      const res = await busService.getAllBuses();
      console.log("Buses response:", res.data); // Debug log
      setBuses(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load buses and drivers");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBuses();
  }, []);

  return (
    <div className="min-vh-100 bg-light">
      <Navbar/>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-xl-11">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-gradient bg-primary text-white text-center py-4">
                <h2 className="mb-0">
                  All Buses & Drivers
                </h2>
                <p className="mb-0 opacity-90">Complete transport information</p>
              </div>

              <div className="card-body p-0">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading buses and drivers...</p>
                  </div>
                ) : buses.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-bus fa-4x text-muted mb-3"></i>
                    <h4 className="text-muted">No buses registered yet</h4>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-primary">
                        <tr>
                          <th className="text-center">#</th>
                          <th>Bus Number</th>
                          <th>Route</th>
                          <th>Status</th>
                          <th>Driver Name</th>
                          <th>Contact</th>
                          <th>Timing</th>
                          <th>Students Assigned</th>
                        </tr>
                      </thead>
                      <tbody>
                        {buses.map((bus, index) => (
                          <tr key={bus.id} className={bus.status ? "table-success" : "table-light"}>
                            <td className="text-center fw-bold">{index + 1}</td>
                            <td>
                              <span className="badge bg-primary fs-5 px-4 py-2">
                                {bus.number}
                              </span>
                            </td>
                            <td>{bus.route || "—"}</td>
                            <td>
                              <span className={`badge ${bus.status ? "bg-success" : "bg-secondary"} fs-6`}>
                                {bus.status ? "Running" : "Stopped"}
                              </span>
                            </td>
                            <td>
                              {bus.driverName ? (
                                <strong>{bus.driverName}</strong>
                              ) : (
                                <span className="text-danger">No Driver</span>
                              )}
                            </td>
                            <td>
                              {bus.driverId ? (
                                // Note: Contact number is not included in BusDTO
                                <span className="text-muted">{bus.driverContact}</span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td>
                              {bus.driverId ? (
                                <>
                                  <div><strong>Pick:</strong> {bus.pickTime}</div>
                                  <div><strong>Drop:</strong> {bus.dropTime}</div>
                                </>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td>
                              {bus.studentIds && bus.studentIds.length > 0 ? (
                                <div className="small">
                                  <strong>Total: {bus.studentIds.length} students</strong>
                                </div>
                              ) : (
                                <em className="text-muted">No students</em>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="card-footer bg-white text-center py-4">
                <p className="mb-0">
                  Total Buses: <strong>{buses.length}</strong> | 
                  With Driver: <strong>{buses.filter(b => b.driverName).length}</strong> | 
                  Running: <strong>{buses.filter(b => b.status).length}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDriver;