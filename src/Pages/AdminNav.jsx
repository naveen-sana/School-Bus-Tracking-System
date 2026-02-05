import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminNav = () => {
  const navigate=useNavigate();
  const handleLogout =() => {
    localStorage.clear("token");
  }
  return (
    <div>
      <ul className="nav  bg-primary">
        <li className="navbar-brand me-auto">
          <a
            className="nav-link active text-light text-active ms-auto"
            aria-current="page"
            href="/"
          >
            <b>SCHOOL BUS TRACKING SYSTEM</b>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link text-light" href="/addBus">
            AddBus
          </a>
        </li>
        {/* <li className="nav-item">
          <a className="nav-link text-light" href="/addDriver">
            AddDriver
          </a>
        </li>

        <li className="nav-item text-light ">
          <a
            className="nav-link active text-light ms-auto justify-content-center"
            aria-current="page"
            href="/addStudents"
          >
            AddStudents
          </a>
        </li> */}

        <li className="nav-item">
          <a className="nav-link text-light" href="/viewDriver">
            ViewDriver&Bus
          </a>
        </li>
        <li className="nav-item ">
          <a className="nav-link text-light" href="/viewComplaints">
            ViewComplaints
          </a>
        </li>
        <li className="nav-item ">
          <Link className="nav-link text-light"  to="/" onClick={handleLogout}>
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminNav;
