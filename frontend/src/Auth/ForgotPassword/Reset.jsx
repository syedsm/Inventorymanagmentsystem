import { Link, useNavigate } from "react-router-dom";
import {  useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

function Reset() {
  const [email, setEmail] = useState("");
  const Navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please fill in your email!");
      return;
    }
    const data = { email };

    try {
      // setLoading(true);

      const res = await axios.post("https://inventorymanagmentsystembackend.onrender.com/api/auth/resetpage", data);

      console.log(res);
      if (res.status === 200 && res.data.message) {
        localStorage.setItem("tempdata", res.data.email);
        toast.success(res.data.message, {
          onClose: () => 
            Navigate("/verify-otp"),
          
        });
      } else {
        toast.error("Unexpected response. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred during the reset. Please try again.");
      }
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container-fluid d-flex">
        <div className="left-side">{/* Left side for background image */}</div>
        <div className="right-side d-flex">
          <section id="login" className=" p-4 login-container">
            <div className="text-center">
              <img src="/logo.png" alt="Logo" width="40" height="40" />
            </div>
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="heading mt-3">
                  <h2 className="mb-0 text-center">Welcome Back</h2>
                  <p className="mt-3 text-center">
                    Enter your email to access your account
                  </p>
                </div>

                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label className="form-label">Enter Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="d-flex justify-content-center align-items-center mt-3 mb-3">
                    <button
                      type="submit"
                      className="bg-dark text-white btn-block form-control"
                    >
                      Submit
                    </button>
                  </div>

                  <div className="text-center mt-5">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="signup-link">
                      Sign Up
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Reset;
