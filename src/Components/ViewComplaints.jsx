import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import AdminNav from "../Pages/AdminNav";
import complaintService from "../api/complaintService";
import Navbar from "./Navbar";

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

 
  const fetchComplaints = async () => {
    try {
      const res = await complaintService.getAllComplaints();
      setComplaints(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load complaints");
      setLoading(false);
    }
  };

  // Delete complaint
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;

    try {
      await complaintService.deleteComplaint(id);
      setComplaints(complaints.filter(c => c.id !== id));
      toast.success("Complaint deleted successfully");
    } catch (err) {
      toast.error("Failed to delete complaint");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-primary text-white text-center py-4">
                <h2 className="mb-0">
                  Parent Complaints Dashboard
                </h2>
              </div>

              <div className="card-body p-0">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading complaints...</p>
                  </div>
                ) : complaints.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-comment-slash fa-4x text-muted mb-3"></i>
                    <h4 className="text-muted">No complaints received yet</h4>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-primary">
                        <tr>
                          <th className="text-center">#</th>
                          <th>Student Name</th>
                          <th>Roll Number</th>
                          <th>Degree</th>
                          <th>Complaint</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {complaints.map((item, index) => (
                          <tr key={item.id}>
                            <td className="text-center fw-bold">{index + 1}</td>
                            <td>
                              <strong>{item.studentName}</strong>
                            </td>
                            <td>{item.rollNumber}</td>
                            <td>{item.degree || "N/A"}</td>
                            <td>
                              <span className="badge bg-warning text-dark px-3 py-2">
                                {item.complaint}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="card-footer text-center text-muted py-3">
                Total Complaints: <strong>{complaints.length}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewComplaints;