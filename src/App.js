// src/App.js
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Index from "./Pages/Index";
import Login from "./Pages/Login";
import ParentLogin from "./Pages/ParentLogin";
import AdminHome from "./Pages/AdminHome";
import ParentHome from "./Pages/ParentHome";
import AddBus from "./Pages/AddBus";
import AddStudent from "./Pages/AddStudent";
import AddDriver from "./Pages/AddDriver";
import ViewDriver from "./Components/ViewDriver";
import ViewBus from "./Components/ViewBus";
import Complaint from "./Pages/Complaint";
import ViewComplaints from "./Components/ViewComplaints";
import ViewDetail from "./Components/ViewDetail";
import LiveLocation from "./Components/LiveLocation";
import Driver from "./Components/Driver";
import UpdateLocation from "./Pages/UpdateLocation";
import DriverLogin from "./Pages/DriverLogin";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem("role");
  
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect based on role
    if (role === "ADMIN") {
      return <Navigate to="/adminDashboard" />;
    } else if (role === "PARENT") {
      return <Navigate to="/parentHome" />;
    } else {
      return <Navigate to="/" />;
    }
  }
  
  return children;
};

function App() {
  return (
    <div className="App">
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/parentLogin" element={<ParentLogin />} />
          <Route path="/driverLogin" element={<DriverLogin/>}/>
          <Route path="/driver" element={<Driver />} />
          
          {/* Admin Protected Routes */}
          <Route path="/adminDashboard" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminHome />
            </ProtectedRoute>
          } />
          
          <Route path="/addBus" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AddBus />
            </ProtectedRoute>
          } />
          
          <Route path="/addStudents/:id" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AddStudent />
            </ProtectedRoute>
          } />
          
          <Route path="/addDriver/:id" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AddDriver />
            </ProtectedRoute>
          } />
          
          <Route path="/viewDriver" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ViewDriver />
            </ProtectedRoute>
          } />
          
          <Route path="/viewBus" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ViewBus />
            </ProtectedRoute>
          } />
          
          <Route path="/viewComplaints" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ViewComplaints />
            </ProtectedRoute>
          } />
          
          {/* Parent Protected Routes */}
          <Route path="/parentHome" element={
            <ProtectedRoute allowedRoles={["PARENT"]}>
              <ParentHome />
            </ProtectedRoute>
          } />
          
          <Route path="/viewDetails" element={
            <ProtectedRoute allowedRoles={["PARENT"]}>
              <ViewDetail />
            </ProtectedRoute>
          } />
          
          <Route path="/liveLocation" element={
            <ProtectedRoute allowedRoles={["PARENT"]}>
              <LiveLocation />
            </ProtectedRoute>
          } />
          
          <Route path="/complaint" element={
            <ProtectedRoute allowedRoles={["PARENT"]}>
              <Complaint />
            </ProtectedRoute>
          } />
          
          {/* Driver Route */}
          <Route path="/updateLocation" element={
            <ProtectedRoute allowedRoles={["DRIVER"]}>
              <UpdateLocation />
            </ProtectedRoute>
          } />
          
          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;