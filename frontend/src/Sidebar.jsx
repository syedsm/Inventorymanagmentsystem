import { useState } from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  const [productDropdown, setProductDropdown] = useState(false);
  const [reportDropdown, setReportDropdown] = useState(false);

  const toggleProductDropdown = () => setProductDropdown(!productDropdown);
  const toggleReportDropdown = () => setReportDropdown(!reportDropdown);

  return (
    <div
      className="sidebar pt-5"
      style={{
        position: "fixed",
        top: "85px",
        left: "0",
        width: "15%",
        backgroundColor: "black",
        height: "calc(100vh - 85px)",
        overflowY: "auto",
      }}
    >
      <div className="sidebar-header text-center">
        <img
          src="/fulfillment-15309656-unscreen.gif"
          alt="Menu GIF"
          className="img-fluid"
          style={{ maxWidth: "80px" }}
        />
        <h4 className="menu-title text-white">Menu</h4>
      </div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link
            className="nav-link d-flex align-items-center text-white"
            to="/dashboard"
          >
            <i className="bi bi-house me-2"></i> Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <a
            className="nav-link d-flex align-items-center text-white"
            href="#"
            onClick={toggleProductDropdown}
          >
            <i className="bi bi-box me-2"></i> Manage Products
            <i
              className={`bi ${
                productDropdown ? "bi-chevron-up" : "bi-chevron-down"
              } ms-auto mx-1`}
            ></i>
          </a>
          {productDropdown && (
            <ul className="submenu">
              <li>
                <Link
                  className="dropdown-item text-white ps-5"
                  to="/productlist"
                >
                  Product List
                </Link>
              </li>
              <li>
                <Link className="dropdown-item text-white ps-5" to="/add">
                  Create Product
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item text-white ps-5"
                  to="/updateproduct"
                >
                  Update Product
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="nav-item">
          <a className="nav-link d-flex align-items-center text-white" href="#">
            <i className="bi bi-bar-chart-line me-2"></i> Stock Levels
          </a>
        </li>
        <li className="nav-item">
          <Link className="nav-link d-flex align-items-center text-white" to="/manageusers">
            <i className="bi bi-people"></i> Manage Users
          </Link>
        </li>
        <li className="nav-item">
          <a
            className="nav-link d-flex align-items-center text-white"
            href="#"
            onClick={toggleReportDropdown}
          >
            <i className="bi bi-file-earmark-text me-2"></i> Reports
            <i
              className={`bi ${
                reportDropdown ? "bi-chevron-up" : "bi-chevron-down"
              } ms-auto`}
            ></i>
          </a>
          {reportDropdown && (
            <ul className="submenu">
              <li>
                <a className="dropdown-item text-white ps-5" href="#">
                  Sales Report
                </a>
              </li>
              <li>
                <a className="dropdown-item text-white ps-5" href="#">
                  Inventory Report
                </a>
              </li>
              <li>
                <a className="dropdown-item text-white ps-5" href="#">
                  Supplier Report
                </a>
              </li>
            </ul>
          )}
        </li>
        <li className="nav-item mb-2">
          <a className="nav-link d-flex align-items-center text-white" href="#">
            <i className="bi bi-gear me-2"></i> Settings
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
