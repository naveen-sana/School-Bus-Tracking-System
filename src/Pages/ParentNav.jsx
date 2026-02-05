import React from "react";

const ParentNav = () => {
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
            href="/viewDetais"
          >
         ViewDetails
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-light" href="/complaint">
  RaiseCompalint
          </a>
        </li>
        {/* <li className="nav-item ">
          <a className="nav-link text-light" href="/viewLocation">
            ViewLocation
          </a>
        </li> */}
        <li className="nav-item ">
          <a className="nav-link text-light" href="/">
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ParentNav;
