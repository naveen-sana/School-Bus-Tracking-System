import React from "react";
import Navbar from "../Components/Navbar";

const ViewDetails = () => {
  // Hardcoded data based on the provided JSON response
  const data = {
    id: 1,
    number: "BUS-001",
    route: "Tirupati - chandragiri - chitoor",
    location: "13.629460, 79.414111",
    status: true,
    students: [
      {
        name: "super",
        parentName: "bumber",
        pemail: "bumpr@gmail.com",
        mobileNumber: 9632145874,
        rollNumber: 1,
        sid: 2,
        taddress: null,
        paddress: null,
      },
    ],
    driver: {
      name: "user",
      contactNumber: 9632145874,
      pickTime: "07:30",
      dropTime: "16:30",
      did: 1,
    },
  };

  // Since there's at least one student and a driver, the child is assigned
  const hasBus = true;
  const student = data.students[0]; // Assuming single child view
  const bus = data;
  const driver = data.driver;

  // Function to open Google Maps with the coordinates
  const openMap = () => {
    const [lat, lng] = bus.location.split(", ").map(Number);
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  return (
    <div className="min-vh-100" style={{ background: "linear-gradient(135deg, #e0f7fa, #80deea)" }}>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-primary text-white text-center py-4">
                <h2 className="mb-3">My Child's Bus Details</h2>
                <h4 className="mb-0">{student.name}'s Transport Information</h4>
              </div>
              <div className="card-body p-4 p-md-5">
                {!hasBus ? (
                  <div className="alert alert-warning text-center py-5 my-4">
                    <h4 className="mb-3">Your child is not assigned to any bus yet.</h4>
                    <p className="mb-0">
                      Please contact school administration for bus assignment.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Student Information Card */}
                    <div className="card border-info mb-4">
                      <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Student Information</h5>
                        <span className="badge bg-light text-dark">ID: {student.sid}</span>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <p><strong>Name:</strong> {student.name}</p>
                            <p><strong>Roll Number:</strong> {student.rollNumber}</p>
                            <p><strong>Mobile:</strong>
                              <a href={`tel:${student.mobileNumber}`} className="ms-2 text-decoration-none">
                                {student.mobileNumber}
                              </a>
                            </p>
                          </div>
                          <div className="col-md-6">
                            <p><strong>Parent Name:</strong> {student.parentName}</p>
                            <p><strong>Parent Email:</strong>
                              <a href={`mailto:${student.pemail}`} className="ms-2 text-decoration-none">
                                {student.pemail}
                              </a>
                            </p>
                            <p><strong>Permanent Address:</strong> {student.paddress || "Not provided"}</p>
                            <p><strong>Temporary Address:</strong> {student.taddress || "Not provided"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row g-4">
                      {/* Bus Details Card */}
                      <div className="col-md-6">
                        <div className="card border-primary h-100">
                          <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Bus Details</h5>
                          </div>
                          <div className="card-body">
                            <p><strong>Bus Number:</strong> {bus.number}</p>
                            <p><strong>Route:</strong> {bus.route}</p>
                            <p>
                              <strong>Current Location:</strong>{" "}
                              <button onClick={openMap} className="btn btn-link p-0 border-0 text-primary align-baseline">
                                View on Map
                              </button>
                            </p>
                            <p><strong>Status:</strong> <span className="badge bg-success">Active</span></p>
                          </div>
                        </div>
                      </div>

                      {/* Driver Details Card */}
                      <div className="col-md-6">
                        <div className="card border-success h-100">
                          <div className="card-header bg-success text-white">
                            <h5 className="mb-0">Driver Details</h5>
                          </div>
                          <div className="card-body">
                            <p><strong>Name:</strong> {driver.name}</p>
                            <p><strong>Contact:</strong>
                              <a href={`tel:${driver.contactNumber}`} className="ms-2 text-decoration-none">
                                {driver.contactNumber}
                              </a>
                            </p>
                            <p><strong>Pickup Time:</strong> {driver.pickTime}</p>
                            <p><strong>Drop Time:</strong> {driver.dropTime}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Important Notes */}
                    <div className="mt-4">
                      <div className="alert alert-secondary">
                        <h6 className="mb-2">Important Notes:</h6>
                        <ul className="mb-0">
                          <li>Please ensure your child is at the pickup point 5 minutes before the scheduled time.</li>
                          <li>Contact the driver directly for any immediate concerns.</li>
                          <li>Notify the school for any permanent address changes.</li>
                          <li>In case of bus delays, contact the driver or school transport office.</li>
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="card-footer bg-light text-center py-3">
                <small className="text-muted">
                  Last updated: {new Date().toLocaleDateString()} {" | "}
                  For updates, contact school administration
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;