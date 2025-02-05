import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import OtpInput from "react-otp-input";

function Activation() {
  const [otp, setOtp] = useState();
  const [tempmail, settempmail] = useState("");
  const [resendTimer, setResendTimer] = useState(120); // Set timer to 300 seconds (5 minutes)
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const Navigate = useNavigate();

  // const handleOtpChange = (value, index) => {
  //   const newOtp = [...otp];
  //   newOtp[index] = value;
  //   setOtp(newOtp);
  // };

  useEffect(() => {
    const storedTempdata = localStorage.getItem("tempdata");
    if (storedTempdata) {
      settempmail(storedTempdata);
    }
    console.log(tempmail);
  }, [tempmail]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 120);

      return () => clearInterval(timer);
    } else {
      setIsResendEnabled(true);
    }
  }, [resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const otpCode = otp.join("");

    // if (otpCode.length !== 4) {
    //   return toast.error("Please enter a 4-digit OTP.");
    // }
    try {
      const response = await axios.post("https://inventorymanagmentsystembackend.onrender.com/auth/forgot_verify_otp", {
        otp: otp,
        email: tempmail,
      });

      if (response.status === 200) {
        // localStorage.removeItem("tempdata");
        toast.success(response.data.message || "OTP verified successfully!", {
          onClose: () => Navigate("/passwordreset"),
        });
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed!");
    }
  };

  const handleresend = async (e) => {
    e.preventDefault();
    if (!isResendEnabled) return;

    try {
      const response = await axios.post("https://inventorymanagmentsystembackend.onrender.com/auth/forgot_resend_otp", {
        email: tempmail,
      });
      toast.success(response.data.message || "OTP resent successfully!");

      setResendTimer(120);
      setIsResendEnabled(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP!");
    }
  };

  return (
    <div className="login-page">
      <div className="container-fluid d-flex">
        <div className="left-side">
          {/* Placeholder for background image if needed */}
        </div>
        <div className="right-side d-flex">
          <section id="login" className="p-4 login-container">
            <div className="text-center mb-4">
              <img src="/logo.png" alt="Logo" width="60" height="60" />
            </div>

            <h2 className="text-center">Forgot Password</h2>
            <p className="text-muted text-center mb-4">
              Please verify the OTP to access your account.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="text-center mb-4">
                <label htmlFor="otp" className="form-label">
                  Enter 4-Digit OTP
                </label>
                <div className="d-flex justify-content-center mb-3">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={4}
                    renderSeparator={<span className="mx-1">-</span>} 
                    renderInput={(props) => (
                      <input
                        {...props}
                        className="form-control text-center"
                        style={{ width: "50px", height: "50px" }} 
                      />
                    )}
                  />
                </div>
                <div className="mt-3">
                  <Link
                    style={{
                      marginLeft: "50%",
                      // marginTop: "50px",
                      textDecoration: "none",
                    }}
                    onClick={handleresend}
                    disabled={!isResendEnabled}
                  >
                    {isResendEnabled
                      ? "Resend OTP"
                      : `Resend in ${resendTimer}s`}
                  </Link>
                </div>
              </div>

              <div className="text-center mb-3 mt-2">
                <button type="submit" className="btn btn-dark">
                  Validate OTP
                </button>
              </div>

              <div className="text-center mt-4">
                <Link to="/signup" className="text-decoration-none">
                  Go Back
                </Link>
              </div>
            </form>
          </section>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Activation;
