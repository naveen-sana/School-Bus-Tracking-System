import React from "react";

const StudentNav = () => {
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
        <li className="nav-item text-light ">
          <a
            className="nav-link active text-light ms-auto justify-content-center"
            aria-current="page"
            href="/addStudents"
          >
         AddStudents
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-light" href="/login">
     AddBus&Driver
          </a>
        </li>
        <li className="nav-item ">
          <a className="nav-link text-light" href="#">
            ViewComplaints
          </a>
        </li>
      </ul>
    </div>
  );
};

export default StudentNav;
