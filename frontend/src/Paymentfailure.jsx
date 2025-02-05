import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Paymentfailure = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract error message from the query parameters
    const params = new URLSearchParams(location.search);
    const error =
      params.get("error") || "Payment failed due to an unknown error.";
    setErrorMessage(error);
  }, [location.search]);

  return (
    <div className="container-fluid" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="row h-100">
        {/* Left Column for Error Message */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-black p-4">
          <h2 className="display-4 mb-4">Payment Failed</h2>
          <p className="lead mb-4 text-center">{errorMessage}</p>
          <button
            className="btn btn-warning btn-lg"
            onClick={() => navigate("/cart")}
            style={{
              padding: "12px 35px",
              fontSize: "18px",
              borderRadius: "25px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              transition: "background-color 0.3s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#FF9800"; // Darker shade on hover
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#FFC107"; // Original color
              e.target.style.transform = "scale(1)";
            }}
          >
            Go back to Cart
          </button>
        </div>
  
        {/* Right Column for Image */}
        <div className="col-md-6 p-0">
          <img
            src="/paymentfailed.jpg"
            alt="Payment failure"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
            }}
          />
        </div>
      </div>
    </div>
  );
  
  
};

export default Paymentfailure;
