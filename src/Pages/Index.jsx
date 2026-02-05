import React from "react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center position-relative overflow-hidden bg-gradient">
      {/* Background Gradient + Pattern */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          zIndex: 1,
        }}
      ></div>
      <div
        className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
        style={{
          backgroundImage: "url('https://img.freepik.com/free-photo/mobile-app-location-digital-art_23-2151762839.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 2,
        }}
      ></div>

      {/* Floating Bus Icons (Decorative) */}
      <div className="position-absolute animate-bus" style={{ top: "10%", left: "10%", zIndex: 3 }}>
        <i className="fas fa-bus fa-3x text-white opacity-50"></i>
      </div>
      <div className="position-absolute animate-bus" style={{ top: "60%", right: "15%", zIndex: 3 }}>
        <i className="fas fa-bus fa-4x text-white opacity-40"></i>
      </div>

      {/* Main Content */}
      <div className="container position-relative" style={{ zIndex: 10 }}>
        <div className="row justify-content-center text-center">
          <div className="col-lg-10 col-xl-8">
            {/* Title with Animation */}
            <h1 className="display-3 fw-bold text-white mb-4 animate__animated animate__fadeInDown">
              School Bus Tracking System
            </h1>

            <p className="lead text-white mb-5 fs-4 animate__animated animate__fadeInUp animate__delay-1s">
              Real-time tracking • Instant alerts • Complete peace of mind
              <br />
              <span className="text-warning">Your child’s safety, our priority.</span>
            </p>

            {/* Feature Highlights */}
            <div className="row g-4 mb-5 animate__animated animate__fadeInUp animate__delay-2s">
              <div className="col-md-4">
                <div className="text-white">
                  <i className="fas fa-map-marked-alt fa-3x mb-3 text-warning"></i>
                  <h5>Live GPS Tracking</h5>
                  <p className="opacity-90">See exact bus location in real-time</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-white">
                  <i className="fas fa-bell fa-3x mb-3 text-success"></i>
                  <h5>Instant Notifications</h5>
                  <p className="opacity-90">Get alerts when bus arrives/departs</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-white">
                  <i className="fas fa-shield-alt fa-3x mb-3 text-info"></i>
                  <h5>Safe & Secure</h5>
                  <p className="opacity-90">Trusted by thousands of parents</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-grid d-md-flex justify-content-center gap-4 animate__animated animate__zoomIn animate__delay-3s">
              <Link
                to="/parentLogin"
                className="btn btn-warning btn-lg px-5 py-3 fw-bold shadow-lg hover-lift"
              >
                Parent/Child Login
              </Link>
              <Link
                to="/login"
                className="btn btn-outline-light btn-lg px-5 py-3 fw-bold shadow-lg hover-lift"
              >
                Admin Login
              </Link>
              <Link
                to="/driverLogin"
                className="btn btn-success btn-lg px-5 py-3 fw-bold shadow-lg hover-lift"
              >
                Driver Login
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="mt-5 text-white animate__animated animate__fadeIn animate__delay-4s">
              <p className="mb-0 opacity-75">
                <i className="fas fa-check-circle text-success me-2"></i>
                Used by <strong>500+ schools</strong> • <strong>50,000+ parents</strong> daily
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bus {
          animation: float 6s ease-in-out infinite;
        }
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
        }
      `}</style>
    </div>
  );
};

export default Index;