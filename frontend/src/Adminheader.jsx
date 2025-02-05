import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Contextapi } from "./contexts/Authcontext";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const Adminheader = ({ handleLogout }) => {
  const { loginemail } = useContext(Contextapi);
  const navigate = useNavigate();
  // console.log("Header Status ", loginpopup);
  const logoutAndRedirect = () => {
    handleLogout(); // Call the logout handler passed as a prop
    navigate("/"); // Navigate to the login page after logout
    toast.success("You have logged out successfully!"); // Show toast notification on login page
  };

  // const handlelogout = () => {
  //   setloginemail(localStorage.removeItem("loginemail"));
  //   setlogin(localStorage.removeItem("authToken"));
  //   // loginpopup(localStorage.setItem("showLoginPopup", "true"));
  //   setloginemail(false);
  //   setlogin(false);
  //   // setloginpopup("true");
  //   navigate("/");
  //   // console.log("Status ", loginpopup);
  // };

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-light shadow-sm py-3 position-fixed w-100">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Left Side: Logo / Inventory Management System */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img
            src="/inventory.png"
            alt="Logo"
            width="40"
            height="40"
            className="d-inline-block align-text-top"
          />
          <span className="ms-2 fw-bold fs-5 text-primary">
            Inventory Management System
          </span>
        </Link>

        {/* Center: Search Bar */}
        <form className="d-flex w-50">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search inventory..."
            aria-label="Search"
          />
          <button className="btn btn-outline-primary" type="submit">
            Search
          </button>
        </form>

        {/* Right Side: Dashboard / Notifications / Help / Profile Pic / Settings */}
        <div className="d-flex align-items-center">
          {/* Dashboard Icon */}
          <a
            href="/dashboard"
            className="me-4 text-decoration-none text-dark fw-semibold fs-6"
            title="Dashboard"
          >
            <i className="bi bi-house-fill fs-5"></i>
          </a>

          {/* Help Icon */}
          <a
            href="/help"
            className="me-4 text-decoration-none text-dark fw-semibold fs-6"
            title="Help"
          >
            <i className="bi bi-question-circle fs-5"></i>
          </a>

          {/* Profile Dropdown */}
          <div className="dropdown d-flex justify-content-center align-items-center">
            <img
              src="/user.png"
              alt="Profile"
              width="30"
              height="30"
              className="rounded-circle border border-2 border-secondary me-2"
            />

            <Link
              to="#"
              className="align-items-center text-decoration-none dropdown-toggle"
              id="profileDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              title="Profile"
            >
              {loginemail}
            </Link>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="profileDropdown"
            >
              <li>
                <Link className="dropdown-item" to="/profilesetting">
                  <i className="bi bi-gear-fill me-2"></i> Settings
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item"
                  to="#"
                  onClick={logoutAndRedirect}
                >
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

// Prop validation for handleLogout prop
Adminheader.propTypes = {
  handleLogout: PropTypes.func.isRequired, // Ensure handleLogout is a required function
};

export default Adminheader;
