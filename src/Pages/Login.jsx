// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../api/authService";
import Navbar from "../Components/Navbar";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authService.adminLogin(form);

      if (res.data.msg === "Admin") {
        localStorage.setItem("role", "ADMIN");
        toast.success("Welcome back, Admin!", {
          icon: "rocket",
        });
        navigate("/adminDashboard");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 position-relative overflow-hidden">
      {/* Animated Background */}
      <div
        className="position-absolute w-100 h-100"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          zIndex: 1,
        }}
      ></div>
      <div
        className="position-absolute w-100 h-100 opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517248135467-2c7ed3f9d706?w=1920')",
          backgroundSize: "cover",
          filter: "blur(8px)",
          zIndex: 2,
        }}
      ></div>

      {/* Navbar */}
      <Navbar />

      {/* Login Card */}
      <div className="container py-5 position-relative" style={{ zIndex: 10 }}>
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card shadow-lg border-0 animate__animated animate__fadeInUp">
              <div className="card-body p-5">
                {/* Logo & Title */}
                <div className="text-center mb-5">
                  <i className="fas fa-user-shield fa-4x text-primary mb-4"></i>
                  <h2 className="fw-bold text-primary">Admin Login</h2>
                  <p className="text-muted">
                    Access School Bus Management Panel
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        placeholder="admin@gmail.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-lock"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg w-100 fw-bold shadow-sm hover-lift"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Login as Admin
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <small className="text-muted">
                    Default: <code>admin@gmail.com</code> / <code>admin</code>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2) !important;
        }
      `}</style>
    </div>
  );
};

export default Login;
