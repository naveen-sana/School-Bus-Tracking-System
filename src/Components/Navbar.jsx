// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

  // Update role and username when they change in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role") || "");
      setUserName(localStorage.getItem("userName") || "");
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also check on location change (in case login/logout happens)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setRole("");
    setUserName("");
    if (role === "ADMIN") {
      navigate("/login");
    } else if (role === "PARENT") {
      navigate("/parentLogin");
    } else {
      navigate("/");
    }
    window.location.reload();
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-lg sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center" to="/">
          <i className="fas fa-bus me-2"></i>
          School Bus Tracker
        </Link>
        
        {userName && (
          <div className="navbar-text d-none d-lg-block text-white me-3">
            Welcome, <strong>{userName}</strong>
          </div>
        )}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto align-items-center">
            {!role ? (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/login")}`} to="/login">
                    <i className="fas fa-user-shield me-1"></i> Admin Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/parentLogin")}`} to="/parentLogin">
                    <i className="fas fa-users me-1"></i> Parent Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/driverLogin")}`} to="/driverLogin">
                    <i className="fas fa-id-card me-1"></i> Driver Login
                  </Link>
                </li>
              </>
            ) : role === "ADMIN" ? (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/adminDashboard")}`} to="/adminDashboard">
                    <i className="fas fa-home me-1"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/addBus")}`} to="/addBus">
                    <i className="fas fa-bus me-1"></i> Add Bus
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/viewBus")}`} to="/viewBus">
                    <i className="fas fa-list me-1"></i> View Buses
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link className={`nav-link ${isActive("/addStudents")}`} to="/addStudents">
                    <i className="fas fa-user-plus me-1"></i> Add Students
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/addDriver")}`} to="/addDriver">
                    <i className="fas fa-id-card-alt me-1"></i> Add Driver
                  </Link>
                </li> */}
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/viewDriver")}`} to="/viewDriver">
                    <i className="fas fa-tachometer-alt me-1"></i> View Drivers
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/viewComplaints")}`} to="/viewComplaints">
                    <i className="fas fa-comments me-1"></i> Complaints
                  </Link>
                </li>
                <li className="nav-item">
                  <button 
                    className="btn btn-outline-light ms-3" 
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt me-1"></i> Logout
                  </button>
                </li>
              </>
            ) : role === "PARENT" ? (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/parentHome")}`} to="/parentHome">
                    <i className="fas fa-home me-1"></i> Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/viewDetails")}`} to="/viewDetails">
                    <i className="fas fa-child me-1"></i> My Child
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/liveLocation")}`} to="/liveLocation">
                    <i className="fas fa-map-marker-alt me-1"></i> Live Location
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/complaint")}`} to="/complaint">
                    <i className="fas fa-exclamation-circle me-1"></i> Complaint
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light ms-3" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-1"></i> Logout
                  </button>
                </li>
              </>
            ) : null}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;