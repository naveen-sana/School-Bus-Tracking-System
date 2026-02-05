// src/pages/AddStudent.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import busService from "../api/busService";
import studentService from "../api/studentService";
import Navbar from "../Components/Navbar";

const AddStudent = () => {
  const { id: busId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    parentName: "",
    pemail: "",
    mobileNumber: "",
    rollNumber: "",
    pAddress: "",
    tAddress: "",
  });

  const [errors, setErrors] = useState({});
  const [busInfo, setBusInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Student name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Student name must be at least 2 characters";
    }
    
    // Parent name validation
    if (!formData.parentName.trim()) {
      newErrors.parentName = "Parent name is required";
    } else if (formData.parentName.trim().length < 2) {
      newErrors.parentName = "Parent name must be at least 2 characters";
    }
    
    // Email validation
    if (!formData.pemail.trim()) {
      newErrors.pemail = "Parent email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.pemail)) {
      newErrors.pemail = "Please enter a valid email address";
    }
    
    // Mobile number validation
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be exactly 10 digits";
    }
    
    // Pickup address validation
    if (!formData.tAddress.trim()) {
      newErrors.tAddress = "Pickup address is required";
    } else if (formData.tAddress.trim().length < 5) {
      newErrors.tAddress = "Please enter a valid pickup address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchBus = async () => {
      setLoading(true);
      try {
        const res = await busService.getBusById(busId);
        setBusInfo(res.data);
      } catch (err) {
        console.error("Error fetching bus:", err);
        toast.error("Failed to load bus details");
      } finally {
        setLoading(false);
      }
    };
    if (busId) fetchBus();
  }, [busId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    // For numeric fields, only allow numbers
    if (name === "mobileNumber" || name === "rollNumber") {
      // Allow only numbers, max length 10 for mobile, 20 for roll
      const maxLength = name === "mobileNumber" ? 10 : 20;
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, maxLength);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Validate on blur
    if (name === "name" && value.trim() && value.trim().length < 2) {
      setErrors(prev => ({ ...prev, [name]: "Student name must be at least 2 characters" }));
    } else if (name === "parentName" && value.trim() && value.trim().length < 2) {
      setErrors(prev => ({ ...prev, [name]: "Parent name must be at least 2 characters" }));
    } else if (name === "pemail" && value.trim() && !/\S+@\S+\.\S+/.test(value)) {
      setErrors(prev => ({ ...prev, [name]: "Please enter a valid email address" }));
    } else if (name === "mobileNumber" && value && !/^\d{10}$/.test(value)) {
      setErrors(prev => ({ ...prev, [name]: "Mobile number must be exactly 10 digits" }));
    } else if (name === "tAddress" && value.trim() && value.trim().length < 5) {
      setErrors(prev => ({ ...prev, [name]: "Please enter a valid pickup address" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors in the form before submitting");
      return;
    }

    setFormLoading(true);

    try {
      // Prepare payload matching backend Student model EXACTLY
      const studentPayload = {
        name: formData.name.trim(),
        parentName: formData.parentName.trim(),
        pemail: formData.pemail.trim(),
        mobileNumber: formData.mobileNumber ? Number(formData.mobileNumber) : null,
        rollNumber: formData.rollNumber ? Number(formData.rollNumber) : null,
        pAddress: formData.pAddress.trim() || null,
        tAddress: formData.tAddress.trim() || null,
      };

      console.log("Sending student data:", studentPayload);

      // 1. Add Student
      const studentRes = await studentService.addStudent(studentPayload);
      console.log("Student response:", studentRes);
      
      // Extract student ID - FIXED: using lowercase 'sid' based on your response
      let studentId;
      
      if (studentRes?.data?.sid) {
        studentId = studentRes.data.sid;
      } else if (studentRes?.data?.sId) {
        studentId = studentRes.data.sId;
      } else if (studentRes?.data?.id) {
        studentId = studentRes.data.id;
      } else if (studentRes?.data?.data?.sid) {
        studentId = studentRes.data.data.sid;
      } else if (studentRes?.data?.data?.id) {
        studentId = studentRes.data.data.id;
      } else {
        // Log for debugging
        console.error("Could not find student ID in response:", studentRes);
        throw new Error("Student ID not returned from server");
      }

      if (!studentId) {
        throw new Error("Student ID is undefined");
      }

      console.log("Extracted student ID:", studentId);

      toast.success("Student created successfully!");

      // 2. Assign Student to Bus
      if (busId && studentId) {
        try {
          console.log(`Assigning student ${studentId} to bus ${busId}`);
          const assignResponse = await busService.assignStudentToBus(busId, studentId);
          console.log("Assign response:", assignResponse);
          
          if (assignResponse.data?.msg) {
            toast.success(assignResponse.data.msg);
          } else {
            toast.success("Student assigned to bus successfully!");
          }
        } catch (assignErr) {
          console.error("Error assigning to bus:", assignErr);
          
          let assignErrorMessage = "Student created but could not assign to bus";
          if (assignErr.response?.data?.msg) {
            assignErrorMessage = assignErr.response.data.msg;
          } else if (assignErr.response?.data?.message) {
            assignErrorMessage = assignErr.response.data.message;
          }
          
          toast.warning(assignErrorMessage);
        }
      }

      // Reset form
      setFormData({
        name: "",
        parentName: "",
        pemail: "",
        mobileNumber: "",
        rollNumber: "",
        pAddress: "",
        tAddress: "",
      });

      // Clear errors
      setErrors({});

      // Show success and navigate after a short delay
      setTimeout(() => {
        navigate("/viewBus");
      }, 2000);

    } catch (err) {
      console.error("Full error:", err);
      console.error("Error response:", err.response?.data);
      
      let errorMessage = "Failed to add student. Please check all fields.";
      
      if (err.response?.data) {
        // Handle different error response formats
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.msg) {
          errorMessage = err.response.data.msg;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
      
      // Handle specific validation errors from backend
      if (err.response?.status === 400) {
        // Could be duplicate mobile or roll number
        if (err.response.data?.includes("duplicate") || err.response.data?.includes("already")) {
          toast.error("Mobile number or roll number already exists");
        }
      }
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container py-5">
        <div className="row g-5 align-items-center">
          {/* Left Side - Image */}
          <div className="col-lg-6 d-none d-lg-block">
            <div className="card border-0 shadow-lg overflow-hidden rounded-4">
              <img
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800"
                alt="School Bus"
                className="img-fluid"
                style={{ height: "100%", objectFit: "cover" }}
              />
              <div className="card-img-overlay d-flex align-items-end">
                <div className="bg-dark bg-opacity-60 p-4 rounded w-100 text-white">
                  <h3 className="mb-2">Add a New Student</h3>
                  <p className="mb-0">Complete student registration form</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="col-lg-6">
            <div className="card shadow-xl border-0 rounded-4">
              <div className="card-header bg-gradient bg-primary text-white text-center py-4">
                <h3 className="mb-1 fw-bold">Student Registration</h3>
                {busInfo && !loading && (
                  <div className="mt-2">
                    <span className="badge bg-warning text-dark p-2">
                      <i className="fas fa-bus me-1"></i>
                      Bus: {busInfo.number} 
                      {busInfo.route && ` (${busInfo.route})`}
                    </span>
                  </div>
                )}
                {loading && (
                  <div className="mt-2">
                    <span className="spinner-border spinner-border-sm text-warning me-2"></span>
                    Loading bus details...
                  </div>
                )}
              </div>

              <div className="card-body p-4 p-lg-5">
                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-4">
                    {/* Student Name */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Student Full Name <span className="text-danger">*</span>
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-primary text-white">
                          <i className="fas fa-user"></i>
                        </span>
                        <input 
                          type="text" 
                          name="name" 
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          placeholder="Enter student's full name" 
                          value={formData.name} 
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={formLoading}
                          required
                        />
                      </div>
                      {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
                      {!errors.name && <small className="text-muted">Enter student's full name</small>}
                    </div>

                    {/* Parent Name */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Parent/Guardian Name <span className="text-danger">*</span>
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-primary text-white">
                          <i className="fas fa-user-tie"></i>
                        </span>
                        <input 
                          type="text" 
                          name="parentName" 
                          className={`form-control ${errors.parentName ? 'is-invalid' : ''}`}
                          placeholder="Enter parent/guardian name" 
                          value={formData.parentName} 
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={formLoading}
                          required
                        />
                      </div>
                      {errors.parentName && <div className="invalid-feedback d-block">{errors.parentName}</div>}
                      {!errors.parentName && <small className="text-muted">Enter parent or guardian's name</small>}
                    </div>

                    {/* Parent Email */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Parent Email <span className="text-danger">*</span>
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-primary text-white">
                          <i className="fas fa-envelope"></i>
                        </span>
                        <input 
                          type="email" 
                          name="pemail" 
                          className={`form-control ${errors.pemail ? 'is-invalid' : ''}`}
                          placeholder="parent@example.com" 
                          value={formData.pemail} 
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={formLoading}
                          required
                        />
                      </div>
                      {errors.pemail && <div className="invalid-feedback d-block">{errors.pemail}</div>}
                      {!errors.pemail && <small className="text-muted">For notifications and updates</small>}
                    </div>

                    {/* Mobile Number */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Mobile Number <span className="text-danger">*</span>
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-primary text-white">
                          <i className="fas fa-phone"></i>
                        </span>
                        <input 
                          type="tel" 
                          name="mobileNumber" 
                          className={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`}
                          placeholder="10-digit number" 
                          value={formData.mobileNumber} 
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={formLoading}
                          maxLength="10"
                          required
                        />
                      </div>
                      {errors.mobileNumber && <div className="invalid-feedback d-block">{errors.mobileNumber}</div>}
                      {!errors.mobileNumber && <small className="text-muted">Unique 10-digit mobile number</small>}
                    </div>

                    {/* Roll Number */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Roll Number</label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-primary text-white">
                          <i className="fas fa-id-card"></i>
                        </span>
                        <input 
                          type="text" 
                          name="rollNumber" 
                          className="form-control"
                          placeholder="Optional" 
                          value={formData.rollNumber} 
                          onChange={handleChange}
                          disabled={formLoading}
                        />
                      </div>
                      <small className="text-muted">Leave blank if not applicable</small>
                    </div>

                    {/* Permanent Address */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">Permanent Address</label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-primary text-white">
                          <i className="fas fa-home"></i>
                        </span>
                        <input 
                          type="text" 
                          name="pAddress" 
                          className="form-control"
                          placeholder="House no, street, city, state" 
                          value={formData.pAddress} 
                          onChange={handleChange}
                          disabled={formLoading}
                        />
                      </div>
                      <small className="text-muted">Optional - student's home address</small>
                    </div>

                    {/* Pickup Address */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Pickup Point Address <span className="text-danger">*</span>
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-primary text-white">
                          <i className="fas fa-map-marker-alt"></i>
                        </span>
                        <input 
                          type="text" 
                          name="tAddress" 
                          className={`form-control ${errors.tAddress ? 'is-invalid' : ''}`}
                          placeholder="Bus stop location for pickup" 
                          value={formData.tAddress} 
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={formLoading}
                          required
                        />
                      </div>
                      {errors.tAddress && <div className="invalid-feedback d-block">{errors.tAddress}</div>}
                      {!errors.tAddress && <small className="text-muted">Where the student will be picked up</small>}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="btn btn-primary btn-lg w-100 mt-5 fw-bold shadow-lg hover-lift"
                  >
                    {formLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing Registration...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-2"></i>
                        Register Student & Assign to Bus
                      </>
                    )}
                  </button>
                  
                  {/* Back Button */}
                  <div className="text-center mt-3">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => navigate("/viewBus")}
                      disabled={formLoading}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Back to Bus List
                    </button>
                  </div>
                </form>

                {/* Form Tips */}
                <div className="mt-4 p-3 bg-light border rounded">
                  <h6 className="mb-2"><i className="fas fa-info-circle text-primary me-2"></i>Important Notes:</h6>
                  <ul className="mb-0 small">
                    <li>Fields marked with <span className="text-danger">*</span> are required</li>
                    <li>Mobile number must be unique for each student</li>
                    <li>Pickup address is where the bus will collect the student</li>
                    <li>Parent will receive email notifications</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Panel - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="container mt-3">
          <div className="card">
            <div className="card-header bg-warning text-dark">
              <h6 className="mb-0">Debug Information</h6>
            </div>
            <div className="card-body">
              <h6>Current Form Data:</h6>
              <pre className="mb-2 small bg-light p-2 rounded">
                {JSON.stringify(formData, null, 2)}
              </pre>
              <h6>Current Errors:</h6>
              <pre className="mb-0 small bg-light p-2 rounded">
                {JSON.stringify(errors, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important;
          transition: all 0.3s ease;
        }
        .hover-lift {
          transition: all 0.3s ease;
        }
        .form-control:focus {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
        .card {
          transition: transform 0.3s ease;
        }
        .card:hover {
          transform: translateY(-2px);
        }
        .is-invalid {
          border-color: #dc3545;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right calc(0.375em + 0.1875rem) center;
          background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
        }
        .invalid-feedback {
          display: block;
          width: 100%;
          margin-top: 0.25rem;
          font-size: 0.875em;
          color: #dc3545;
        }
      `}</style>
    </>
  );
};

export default AddStudent;