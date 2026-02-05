import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import driverService from "../api/driverService";

const DriverLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    busNumber: "",
    mobileNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Prevent access if already logged in
  useEffect(() => {
    const driverBus = localStorage.getItem("driverBusNumber");
    if (driverBus) {
      navigate("/driver");
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.busNumber.trim()) {
      newErrors.busNumber = "Bus number is required";
    }

    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "mobileNumber") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      const alphanumericValue = value.replace(/[^a-zA-Z0-9-]/g, "").toUpperCase();
      setFormData((prev) => ({ ...prev, [name]: alphanumericValue }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const loginData = {
        busNumber: formData.busNumber.toUpperCase(),
        mobileNumber: formData.mobileNumber,
      };

      console.log("Sending login request:", loginData);

      const response = await driverService.loginDriver(loginData);
      console.log("Login response:", response);

      const { success, msg, bus } = response.data;

      if (success && bus) {
        const { driver, number, route, location, status, students } = bus;

        // Store all necessary data in localStorage
        localStorage.setItem("driverBusNumber", number);
        localStorage.setItem("driverName", driver.name || "Driver");
        localStorage.setItem("driverMobile", driver.contactNumber);
        localStorage.setItem("driverPickTime", driver.pickTime || "N/A");
        localStorage.setItem("driverDropTime", driver.dropTime || "N/A");
        localStorage.setItem("busRoute", route || "Not specified");
        localStorage.setItem("busLocation", location || "School");
        localStorage.setItem("busStatus", status);
        localStorage.setItem("busStudents", JSON.stringify(students || []));
        localStorage.setItem("isDriverLoggedIn", "true");

        toast.success(msg || "Login successful! Welcome back.");

        // Reset form
        setFormData({ busNumber: "", mobileNumber: "" });

        // Redirect
        setTimeout(() => {
          navigate("/driver");
        }, 1000);
      } else {
        throw new Error(msg || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.msg ||
        err.message ||
        "Invalid bus number or mobile number. Please try again.";

      toast.error(errorMessage);

      setFormData((prev) => ({ ...prev, mobileNumber: "" }));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info("Please contact school administration for assistance");
  };

  return (
    <>
      <div
        className="min-vh-100 d-flex align-items-center"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="text-center mb-5">
                <h1 className="display-4 fw-bold text-white mb-3">
                  <i className="fas fa-bus me-3"></i>
                  School Bus Driver Login
                </h1>
                <p className="lead text-white opacity-90">
                  Secure access to bus tracking and management system
                </p>
              </div>

              <div className="card shadow-5 border-0 rounded-4">
                <div
                  className="card-header bg-gradient text-white text-center py-4 rounded-top-4"
                  style={{
                    background: "linear-gradient(135deg, #007bff, #0056b3)",
                  }}
                >
                  <h3 className="mb-2">
                    <i className="fas fa-user-tie me-2"></i>
                    Driver Portal
                  </h3>
                  <p className="mb-0 opacity-90">
                    Enter your bus number and mobile number
                  </p>
                </div>

                <div className="card-body p-4 p-md-5">
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        <i className="fas fa-bus me-2 text-primary"></i>
                        Bus Number <span className="text-danger">*</span>
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-primary text-white">
                          <i className="fas fa-bus-alt"></i>
                        </span>
                        <input
                          type="text"
                          name="busNumber"
                          className={`form-control ${
                            errors.busNumber ? "is-invalid" : ""
                          }`}
                          placeholder="e.g., BUS-001"
                          value={formData.busNumber}
                          onChange={handleChange}
                          disabled={loading}
                          autoFocus
                          required
                        />
                      </div>
                      {errors.busNumber && (
                        <div className="invalid-feedback d-block">
                          {errors.busNumber}
                        </div>
                      )}
                      <small className="text-muted">
                        Enter your assigned bus number
                      </small>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        <i className="fas fa-mobile-alt me-2 text-primary"></i>
                        Mobile Number <span className="text-danger">*</span>
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-primary text-white">
                          <i className="fas fa-lock"></i>
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="mobileNumber"
                          className={`form-control ${
                            errors.mobileNumber ? "is-invalid" : ""
                          }`}
                          placeholder="10-digit mobile number"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          disabled={loading}
                          maxLength="10"
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                        >
                          <i
                            className={`fas fa-${
                              showPassword ? "eye-slash" : "eye"
                            }`}
                          ></i>
                        </button>
                      </div>
                      {errors.mobileNumber && (
                        <div className="invalid-feedback d-block">
                          {errors.mobileNumber}
                        </div>
                      )}
                      <small className="text-muted">
                        Your registered mobile number
                      </small>
                    </div>

                    <div className="mb-4 text-end">
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none p-0"
                        onClick={handleForgotPassword}
                        disabled={loading}
                      >
                        <i className="fas fa-question-circle me-1"></i>
                        Forgot credentials?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary btn-lg w-100 fw-bold shadow-lg hover-lift"
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Logging in...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Login as Driver
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-5 pt-4 border-top">
                    <div className="alert alert-info border-0">
                      <h6 className="alert-heading">
                        <i className="fas fa-info-circle me-2"></i>
                        Important Information
                      </h6>
                      <ul className="mb-0 small">
                        <li>Use the bus number and mobile number provided by school</li>
                        <li>Your mobile number serves as your password</li>
                        <li>Contact school administration if you have login issues</li>
                        <li>Keep your login credentials secure</li>
                      </ul>
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <Link to="/" className="btn btn-outline-secondary">
                      <i className="fas fa-home me-2"></i>
                      Back to Home
                    </Link>
                  </div>
                </div>
              </div>

              <div className="text-center mt-4">
                <div className="d-inline-flex align-items-center bg-white p-3 rounded-3 shadow-sm">
                  <i className="fas fa-shield-alt fa-2x text-success me-3"></i>
                  <div className="text-start">
                    <h6 className="mb-0 fw-bold">Secure Login</h6>
                    <small className="text-muted">Your data is protected</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
          transition: all 0.3s ease;
        }
        .hover-lift {
          transition: all 0.3s ease;
        }
        .card {
          transition: transform 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
        }
        .shadow-5 {
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
        }
        .rounded-4 {
          border-radius: 1.5rem !important;
        }
        .rounded-top-4 {
          border-top-left-radius: 1.5rem !important;
          border-top-right-radius: 1.5rem !important;
        }
      `}</style>
    </>
  );
};

export default DriverLogin;