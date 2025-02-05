import { Link, useNavigate, useLocation, useMatch } from "react-router-dom";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { useContext, useState, useEffect } from "react";
import { Contextapi } from "../../contexts/Authcontext";

function Userheader({ handleLogout }) {
  const navigate = useNavigate();
  const { login, cart } = useContext(Contextapi);
  const location = useLocation();
  const matchProductPage = useMatch("/productpage/:id");
  const matchPaymentformpage = useMatch("/paymentform/:totalAmount");

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logoutAndRedirect = () => {
    handleLogout();
    navigate("/");
    toast.success("You have logged out successfully!");
  };

  const isCartPage =
    location.pathname === "/cart" ||
    location.pathname === "/buy" ||
    location.pathname === "/success" ||
    location.pathname === "/myorder" ||
    location.pathname === "/myprofile" ||
    location.pathname === "/failed" ||
    location.pathname === "/buypage" ||
    matchProductPage ||
    matchPaymentformpage;

  // Close the menu when clicking outside of it
  const handleClickOutside = (e) => {
    if (!e.target.closest(".nav-menu") && !e.target.closest(".menu-toggle")) {
      setMenuOpen(false);
    }
  };

  // Add event listener to handle clicks outside when the menu is open
  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      {/* Header Section */}
      <header className="user-header">
        <div className="header-container">
          <Link to="/home">
            <img src="/logo.png" alt="Website Logo" className="logo" />
          </Link>

          {/* Mobile Toggle Button */}
          <button
            className="menu-toggle d-lg-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i className={`bi bi-${menuOpen ? "x" : "list"}`}></i>
          </button>

          {/* Regular Navigation (Visible on larger screens) */}
          <nav className="regular-nav d-none d-lg-flex">
            <ul>
              <li>
                <Link
                  to="/about"
                  className={
                    isCartPage
                      ? "highlight-text"
                      : "text-white text-decoration-none"
                  }
                >
                  <i className="bi bi-info-circle"></i> About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={
                    isCartPage
                      ? "highlight-text"
                      : "text-white text-decoration-none"
                  }
                >
                  <i className="bi bi-envelope"></i> Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className={
                    isCartPage
                      ? "highlight-text"
                      : "text-white text-decoration-none"
                  }
                >
                  <i className="bi bi-cart"></i> {cart.totalItems || 0}
                </Link>
              </li>
              {login && (
                <>
                  <li
                    className="dropdown"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <Link
                      to="#"
                      className={
                        isCartPage
                          ? "highlight-text"
                          : "text-white text-decoration-none"
                      }
                    >
                      <i className="bi bi-person"></i> User
                    </Link>
                    <ul
                      className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}
                    >
                      <li>
                        <Link
                          to="/myprofile"
                          className="text-dark text-decoration-none"
                        >
                          <i className="bi bi-person"></i> Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/myorder"
                          className="text-dark text-decoration-none"
                        >
                          <i className="bi bi-card-list"></i> My Orders
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link
                      onClick={logoutAndRedirect}
                      className={
                        isCartPage
                          ? "highlight-text"
                          : "text-white text-decoration-none"
                      }
                    >
                      <i className="bi bi-box-arrow-right"></i> Logout
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Mobile Navigation (Toggle Menu) */}
          <nav className={`nav-menu ${menuOpen ? "active" : ""}`}>
            <button className="close-toggle" onClick={() => setMenuOpen(false)}>
              <i className="bi bi-x"></i>
            </button>
            <ul>
              <li>
                <Link to="/about" className="text-white text-decoration-none">
                  <i className="bi bi-info-circle"></i> About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white text-decoration-none">
                  <i className="bi bi-envelope"></i> Contact
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-white text-decoration-none">
                  <i className="bi bi-cart"></i> {cart.totalItems || 0}
                </Link>
              </li>
              {login && (
                <>
                  <li
                    className="dropdown"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <Link to="#" className="text-white text-decoration-none">
                      <i className="bi bi-person"></i> User
                    </Link>
                    <ul
                      className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}
                    >
                      <li>
                        <Link
                          to="/myprofile"
                          className="text-dark text-decoration-none"
                        >
                          <i className="bi bi-person"></i> Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/myorder"
                          className="text-dark text-decoration-none"
                        >
                          <i className="bi bi-card-list"></i> My Orders
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link
                      onClick={logoutAndRedirect}
                      className="text-white text-decoration-none"
                    >
                      <i className="bi bi-box-arrow-right"></i> Logout
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}

Userheader.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default Userheader;
