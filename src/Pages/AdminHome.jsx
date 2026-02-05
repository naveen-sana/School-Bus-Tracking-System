// src/pages/AdminHome.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import busService from "../api/busService";
import studentService from "../api/studentService";
import driverService from "../api/driverService";
import Navbar from "../Components/Navbar";

const AdminHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBuses: 0,
    totalStudents: 0,
    totalDrivers: 0,
    runningBuses: 0,
    complaints: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [busesRes, studentsRes, driversRes] = await Promise.all([
        busService.getAllBuses(),
        studentService.getAllStudents(),
        driverService.getAllDrivers()
      ]);

      const buses = busesRes.data;
      const students = studentsRes.data;
      const drivers = driversRes.data;

      setStats({
        totalBuses: buses.length,
        totalStudents: students.length,
        totalDrivers: drivers.length,
        runningBuses: buses.filter(b => b.status).length,
        complaints: 0, // You'll need to fetch this from complaints API
      });
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{width: "3rem", height: "3rem"}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      
      <div className="container-fluid py-4">
        {/* Welcome Banner */}
        <div className="row mb-4">
          <div className="col">
            <div className="card bg-primary text-white shadow-lg border-0 overflow-hidden">
              <div className="card-body py-5">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h1 className="display-6 fw-bold mb-3">
                      Welcome to Admin Dashboard
                    </h1>
                    <p className="lead mb-0 opacity-75">
                      Manage school transportation efficiently and effectively
                    </p>
                  </div>
                  <div className="col-md-4 text-center">
                    <div className="position-relative">
                      <i className="fas fa-user-shield fa-5x text-white opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-4 mb-4">
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100 hover-shadow">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                    <i className="fas fa-bus fa-2x text-primary"></i>
                  </div>
                  <h2 className="display-4 fw-bold mb-0">{stats.totalBuses}</h2>
                </div>
                <h6 className="text-muted mb-0">Total Buses</h6>
                <div className="mt-3">
                  <Link to="/viewBus" className="btn btn-primary btn-sm w-100">
                    <i className="fas fa-eye me-1"></i> View All
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100 hover-shadow">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                    <i className="fas fa-users fa-2x text-success"></i>
                  </div>
                  <h2 className="display-4 fw-bold mb-0">{stats.totalStudents}</h2>
                </div>
                <h6 className="text-muted mb-0">Total Students</h6>
                <div className="mt-3">
                  <Link to="/addStudents" className="btn btn-success btn-sm w-100">
                    <i className="fas fa-plus me-1"></i> Add Student
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100 hover-shadow">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                    <i className="fas fa-id-card-alt fa-2x text-warning"></i>
                  </div>
                  <h2 className="display-4 fw-bold mb-0">{stats.totalDrivers}</h2>
                </div>
                <h6 className="text-muted mb-0">Total Drivers</h6>
                <div className="mt-3">
                  <Link to="/viewDriver" className="btn btn-warning btn-sm w-100">
                    <i className="fas fa-eye me-1"></i> View All
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100 hover-shadow">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                    <i className="fas fa-play-circle fa-2x text-info"></i>
                  </div>
                  <h2 className="display-4 fw-bold mb-0">{stats.runningBuses}</h2>
                </div>
                <h6 className="text-muted mb-0">Running Buses</h6>
                <div className="mt-3">
                  <Link to="/viewBus" className="btn btn-info btn-sm w-100">
                    <i className="fas fa-tachometer-alt me-1"></i> Monitor
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0">
                  <i className="fas fa-bolt text-primary me-2"></i>
                  Quick Actions
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <Link to="/addBus" className="card action-card text-decoration-none border">
                      <div className="card-body text-center py-4">
                        <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: "70px", height: "70px"}}>
                          <i className="fas fa-bus fa-2x text-primary"></i>
                        </div>
                        <h6 className="card-title mb-2">Add New Bus</h6>
                        <small className="text-muted">Register a new bus to the system</small>
                      </div>
                    </Link>
                  </div>
                  
                  <div className="col-md-4">
                    <Link to="/addStudents" className="card action-card text-decoration-none border">
                      <div className="card-body text-center py-4">
                        <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: "70px", height: "70px"}}>
                          <i className="fas fa-user-plus fa-2x text-success"></i>
                        </div>
                        <h6 className="card-title mb-2">Add Student</h6>
                        <small className="text-muted">Register new student with bus assignment</small>
                      </div>
                    </Link>
                  </div>
                  
                  <div className="col-md-4">
                    <Link to="/addDriver" className="card action-card text-decoration-none border">
                      <div className="card-body text-center py-4">
                        <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: "70px", height: "70px"}}>
                          <i className="fas fa-id-card-alt fa-2x text-warning"></i>
                        </div>
                        <h6 className="card-title mb-2">Add Driver</h6>
                        <small className="text-muted">Register new driver and assign to bus</small>
                      </div>
                    </Link>
                  </div>
                  
                  <div className="col-md-4">
                    <Link to="/viewComplaints" className="card action-card text-decoration-none border">
                      <div className="card-body text-center py-4">
                        <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: "70px", height: "70px"}}>
                          <i className="fas fa-exclamation-circle fa-2x text-danger"></i>
                        </div>
                        <h6 className="card-title mb-2">View Complaints</h6>
                        <small className="text-muted">Check and respond to parent complaints</small>
                      </div>
                    </Link>
                  </div>
                  
                  <div className="col-md-4">
                    <Link to="/viewDriver" className="card action-card text-decoration-none border">
                      <div className="card-body text-center py-4">
                        <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: "70px", height: "70px"}}>
                          <i className="fas fa-tachometer-alt fa-2x text-info"></i>
                        </div>
                        <h6 className="card-title mb-2">Driver Management</h6>
                        <small className="text-muted">View and manage all drivers</small>
                      </div>
                    </Link>
                  </div>
                  
                  <div className="col-md-4">
                    <Link to="/viewBus" className="card action-card text-decoration-none border">
                      <div className="card-body text-center py-4">
                        <div className="bg-secondary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: "70px", height: "70px"}}>
                          <i className="fas fa-list-alt fa-2x text-secondary"></i>
                        </div>
                        <h6 className="card-title mb-2">All Buses</h6>
                        <small className="text-muted">View and manage all registered buses</small>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0">
                  <i className="fas fa-chart-line text-primary me-2"></i>
                  System Status
                </h5>
              </div>
              <div className="card-body">
                <div className="list-group list-group-flush">
                  <div className="list-group-item border-0 px-0 py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-medium">Buses without driver</span>
                      <span className="badge bg-danger">
                        {stats.totalBuses - stats.runningBuses}
                      </span>
                    </div>
                  </div>
                  <div className="list-group-item border-0 px-0 py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-medium">Active students today</span>
                      <span className="badge bg-success">{stats.totalStudents}</span>
                    </div>
                  </div>
                  <div className="list-group-item border-0 px-0 py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-medium">Pending complaints</span>
                      <span className="badge bg-warning">{stats.complaints}</span>
                    </div>
                  </div>
                  <div className="list-group-item border-0 px-0 py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-medium">System uptime</span>
                      <span className="badge bg-success">99.9%</span>
                    </div>
                  </div>
                  <div className="list-group-item border-0 px-0 py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-medium">Today's trips</span>
                      <span className="badge bg-info">24</span>
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

export default AdminHome;