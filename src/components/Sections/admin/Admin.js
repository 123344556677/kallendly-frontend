import React from "react";
import { Link, useHistory } from "react-router-dom";
import { HiOutlineUsers, HiOutlineLogout } from "react-icons/hi";
import { TbBrandBooking } from "react-icons/tb";
import { SiRazorpay } from "react-icons/si";
import logo from "../../Nav/Kallendly.png";
import "./adminStyle.css";

function Admin() {
  const history = useHistory();
  const handleLogout = () => {
    localStorage.setItem("_a", false);
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    history.push("/");
    window.location.reload();
  };
  return (
    <div className="sideBar">
      <div>
        <h4 className="font-weight-bold py-5 px-3">
          <img src={logo} height="50px" alt="kallendly admin logo" />
        </h4>
        <ul className="mx-4">
          <li className="py-3 border-bottom">
            <Link to="/">
              <span className="d-flex align-items-center">
                <HiOutlineUsers className="mr-2" />
                Users
              </span>
            </Link>
          </li>
          <li className="py-3 border-bottom">
            <Link to="/BookingsAdmin">
              <span className="d-flex align-items-center">
                <TbBrandBooking className="mr-2" />
                Bookings
              </span>
            </Link>
          </li>
          <li className="py-3 border-bottom">
            <Link to="/Razorpay">
              <span className="d-flex align-items-center">
                <SiRazorpay className="mr-2" />
                Payments
              </span>
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <ul className="mx-4 py-5">
          <li className="py-3 border-bottom border-top">
            <span onClick={handleLogout} style={{ cursor: "pointer" }}>
              <HiOutlineLogout className="mr-2" />
              Logout
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Admin;
