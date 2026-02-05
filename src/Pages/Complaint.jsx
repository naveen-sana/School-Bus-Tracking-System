import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar";
import complaintService from "../api/complaintService";
import { 
  FaExclamationTriangle, 
  FaUser, 
  FaIdBadge, 
  FaGraduationCap, 
  FaCommentDots, 
  FaPaperPlane, 
  FaHistory, 
  FaInbox,
  FaInfoCircle,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaSort,
  FaFilter
} from "react-icons/fa";

const Complaint = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    rollNumber: "",
    degree: "",
    complaint: "",
  });

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [filterStatus, setFilterStatus] = useState("all");

  // Load student name from localStorage on mount
  useEffect(() => {
    const storedStudentName = localStorage.getItem("studentName");
    const storedRollNumber = localStorage.getItem("rollNumber");

    if (storedStudentName) {
      setFormData((prev) => ({
        ...prev,
        studentName: storedStudentName,
        rollNumber: storedRollNumber || prev.rollNumber,
      }));

      // Fetch complaint history for this student
      fetchComplaintHistory(storedStudentName);
    } else {
      setFetchingHistory(false);
    }
  }, []);

  const fetchComplaintHistory = async (studentName) => {
    if (!studentName) return;

    setFetchingHistory(true);
    try {
      const response = await complaintService.getComplaintByStudentName(studentName);
      const fetchedComplaints = response.data.queries || [];
      // Add timestamp if not present
      const enhancedComplaints = fetchedComplaints.map(comp => ({
        ...comp,
        submittedAt: comp.submittedAt || comp.createdAt || comp.date || new Date().toISOString()
      }));
      setComplaints(enhancedComplaints);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
      toast.warn("Could not load your previous complaints.");
      setComplaints([]);
    } finally {
      setFetchingHistory(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.rollNumber.trim()) {
      toast.warn("Please enter your Roll Number");
      return;
    }
    if (!formData.degree.trim()) {
      toast.warn("Please enter your Class/Degree");
      return;
    }
    if (!formData.complaint.trim()) {
      toast.warn("Please write your complaint");
      return;
    }
    if (formData.complaint.trim().length < 10) {
      toast.warn("Please provide more details about your complaint (minimum 10 characters)");
      return;
    }

    setLoading(true);

    try {
      await complaintService.submitComplaint({
        studentName: formData.studentName.trim(),
        rollNumber: formData.rollNumber.trim(),
        degree: formData.degree.trim(),
        complaint: formData.complaint.trim(),
        responded: false,
        submittedAt: new Date().toISOString(),
      });

      toast.success(
        <div>
          <strong>Complaint submitted successfully!</strong>
          <div className="small">We'll review it and get back to you soon.</div>
        </div>
      );

      // Reset form fields except studentName
      setFormData((prev) => ({
        ...prev,
        rollNumber: "",
        degree: "",
        complaint: "",
      }));

      // Refresh complaint history
      fetchComplaintHistory(formData.studentName);
    } catch (err) {
      console.error("Complaint submission error:", err);
      toast.error(
        <div>
          <strong>Failed to submit complaint</strong>
          <div className="small">Please check your connection and try again.</div>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return formatDate(dateString);
  };

  // Sort and filter complaints
  const getFilteredAndSortedComplaints = () => {
    let filtered = [...complaints];
    
    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(comp => 
        filterStatus === "pending" ? !comp.responded : comp.responded
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.submittedAt);
      const dateB = new Date(b.submittedAt);
      
      if (sortBy === "newest") {
        return dateB - dateA;
      } else if (sortBy === "oldest") {
        return dateA - dateB;
      } else if (sortBy === "status") {
        return (a.responded === b.responded) ? 0 : a.responded ? 1 : -1;
      }
      return 0;
    });
    
    return filtered;
  };

  const sortedAndFilteredComplaints = getFilteredAndSortedComplaints();

  return (
    <div className="min-vh-100 bg-gradient-light">
      <Navbar />
      
      <div className="container-fluid py-4">
        <div className="row g-4">
          {/* Left Column - Complaint Form */}
          <div className="col-lg-7 col-xl-8">
            <div className="sticky-top" style={{ top: '20px' }}>
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="card-header bg-gradient-warning text-dark py-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-white p-3 rounded-3 me-3 shadow-sm">
                      <FaExclamationTriangle size={28} className="text-warning" />
                    </div>
                    <div>
                      <h2 className="h3 mb-1 fw-bold">Raise a New Complaint / Query</h2>
                      <p className="mb-0 text-dark opacity-75">
                        Submit your concerns and we'll address them promptly
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card-body p-4 p-lg-5">
                  <form onSubmit={handleSubmit}>
                    {/* Student Info Row */}
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark mb-2">
                          <FaUser className="me-2" />
                          Student Name
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg bg-light-subtle"
                          value={formData.studentName}
                          readOnly
                          placeholder="Login required"
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark mb-2">
                          <FaIdBadge className="me-2" />
                          Roll Number
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          name="rollNumber"
                          value={formData.rollNumber}
                          onChange={handleChange}
                          placeholder="e.g. 2021001"
                          required
                        />
                      </div>
                    </div>

                    {/* Degree */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark mb-2">
                        <FaGraduationCap className="me-2" />
                        Class / Degree
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        placeholder="e.g. B.Tech CSE, 10th Grade, etc."
                        required
                      />
                    </div>

                    {/* Complaint Textarea */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark mb-2">
                        <FaCommentDots className="me-2" />
                        Complaint / Query Details
                      </label>
                      <textarea
                        className="form-control form-control-lg"
                        rows="6"
                        name="complaint"
                        value={formData.complaint}
                        onChange={handleChange}
                        placeholder="Describe your issue in detail. Be specific about dates, times, and people involved..."
                        required
                      ></textarea>
                      <div className="form-text text-end">
                        {formData.complaint.length}/500 characters
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="d-grid gap-3">
                      <button
                        type="submit"
                        disabled={loading || !formData.studentName}
                        className="btn btn-warning btn-lg fw-bold py-3 shadow-sm"
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="me-2" />
                            Submit Complaint
                          </>
                        )}
                      </button>

                      {!formData.studentName && (
                        <div className="alert alert-info border-0 shadow-sm">
                          <FaInfoCircle className="me-2" />
                          Please log in to submit complaints. Your information will be saved for future reference.
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Complaint History */}
          <div className="col-lg-5 col-xl-4">
            {formData.studentName && (
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden h-100">
                <div className="card-header bg-primary bg-gradient text-white py-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="bg-white bg-opacity-25 p-2 rounded-3 me-3">
                        <FaHistory size={24} />
                      </div>
                      <div>
                        <h3 className="h4 mb-1 fw-bold">Complaint History</h3>
                        <p className="mb-0 opacity-75">
                          {complaints.length} total • {complaints.filter(c => !c.responded).length} pending
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter and Sort Controls */}
                <div className="card-body border-bottom p-4">
                  <div className="row g-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-muted mb-2">
                        <FaFilter className="me-1" /> Status
                      </label>
                      <select 
                        className="form-select form-select-sm"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="all">All Complaints</option>
                        <option value="pending">Pending</option>
                        <option value="responded">Responded</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-muted mb-2">
                        <FaSort className="me-1" /> Sort By
                      </label>
                      <select 
                        className="form-select form-select-sm"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="status">Status</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Complaints List */}
                <div className="card-body p-0" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                  {fetchingHistory ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">Loading your complaint history...</p>
                    </div>
                  ) : sortedAndFilteredComplaints.length === 0 ? (
                    <div className="text-center py-5">
                      <div className="bg-light rounded-3 p-4 mx-4 my-3">
                        <FaInbox size={48} className="text-muted mb-3 opacity-50" />
                        <h5 className="text-muted">No complaints found</h5>
                        <p className="text-muted small">
                          {filterStatus === "all" 
                            ? "You haven't submitted any complaints yet." 
                            : `No ${filterStatus} complaints found.`}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3">
                      {sortedAndFilteredComplaints.map((comp) => (
                        <div 
                          key={comp.id || comp._id || Math.random()} 
                          className="card border-0 shadow-sm rounded-3 mb-3 hover-lift"
                        >
                          <div className="card-body p-4">
                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <span className="badge bg-light text-dark border mb-2">
                                  {comp.degree}
                                </span>
                                <h6 className="fw-bold mb-1">Roll: {comp.rollNumber}</h6>
                              </div>
                              <span
                                className={`badge rounded-pill fw-semibold px-3 py-2 ${
                                  comp.responded
                                    ? "bg-success bg-opacity-10 text-success border border-success"
                                    : "bg-warning bg-opacity-10 text-warning border border-warning"
                                }`}
                              >
                                {comp.responded ? (
                                  <>
                                    <FaCheckCircle className="me-1" />
                                    Responded
                                  </>
                                ) : (
                                  <>
                                    <FaClock className="me-1" />
                                    Pending
                                  </>
                                )}
                              </span>
                            </div>

                            {/* Complaint Text */}
                            <p className="text-dark mb-3">
                              {comp.complaint.length > 150 
                                ? `${comp.complaint.substring(0, 150)}...` 
                                : comp.complaint}
                            </p>

                            {/* Footer */}
                            <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                              <small className="text-muted">
                                <FaCalendarAlt className="me-1" />
                                {getTimeAgo(comp.submittedAt)}
                              </small>
                              {comp.complaint.length > 150 && (
                                <button 
                                  className="btn btn-link btn-sm text-decoration-none p-0"
                                  onClick={() => toast.info(comp.complaint, { autoClose: 10000 })}
                                >
                                  Read more
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx>{`
        .bg-gradient-light {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          min-height: 100vh;
        }
        
        .bg-gradient-warning {
          background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
        }
        
        .hover-lift {
          transition: all 0.2s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
        }
        
        .btn-warning {
          background: linear-gradient(135deg, #ffc107 0%, #ff9900 100%);
          border: none;
          transition: all 0.3s ease;
        }
        
        .btn-warning:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 153, 0, 0.3) !important;
        }
        
        .btn-warning:disabled {
          opacity: 0.6;
        }
        
        .form-control:focus {
          border-color: #ffc107;
          box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.25);
        }
        
        .form-control-lg {
          font-size: 1rem;
          padding: 0.75rem 1rem;
        }
        
        /* Custom scrollbar */
        .card-body::-webkit-scrollbar {
          width: 6px;
        }
        
        .card-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .card-body::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 10px;
        }
        
        .card-body::-webkit-scrollbar-thumb:hover {
          background: #aaa;
        }
      `}</style>
    </div>
  );
};

export default Complaint;