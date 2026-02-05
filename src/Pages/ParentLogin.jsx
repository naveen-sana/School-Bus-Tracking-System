// src/pages/ParentLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../api/authService";

const ParentLogin = () => {
  const [form, setForm] = useState({ name: "", parentName: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.parentLogin(form);
      const data = res.data;

      localStorage.setItem("role", "PARENT");
      localStorage.setItem("studentId", data.studentId);
      localStorage.setItem("studentName", form.name); // Save student name
      localStorage.setItem("parentName", form.parentName);
      localStorage.setItem("busNumber", data.busNumber || "");
      localStorage.setItem("currentLocation", data.currentLocation || "");

      toast.success(`Welcome, Parent of ${form.name}!`);
      navigate("/parentHome");
    } catch (err) {
      toast.error("Invalid student or parent name");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <h3 className="text-center mb-4 fw-bold text-primary">
                  Parent Login
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Student Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter student's name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Parent Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      value={form.parentName}
                      onChange={(e) =>
                        setForm({ ...form, parentName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 py-2">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentLogin;