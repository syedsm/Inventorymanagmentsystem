import { Link, useNavigate } from "react-router-dom";
import {  useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
// import { Contextapi } from "../contexts/Authcontext";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const { setloginpopup } = useContext(Contextapi);
  // const { setLogin } = useContext(Contextapi);

  const Navigate = useNavigate();

  const handlesignup = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      return toast.error("Please fill out all fields!");
    }

    const data = { email, password };

    try {
      const res = await axios.post("https://inventorymanagmentsystembackend.onrender.com/auth/sendotp", data);
      // console.log(res.data.tempdata);
      if (res.status === 200) {
        localStorage.setItem("tempdata", res.data.tempdata);
        toast.success(res.data.message || "OTP sent successfully!", {
          onClose: () => Navigate("/activation"),
        });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div className="login-page">
      <div className="container-fluid d-flex flex-column flex-md-row">
        <div className="left-side d-none d-md-block col-md-6">
          {/* Left side for background image */}
        </div>
        <div className="right-side d-flex  align-items-center col-12 col-md-6">
          <section id="login" className="p-3 p-md-4 login-container w-100">
            <div className="text-center">
              <img src="/logo.png" alt="..." width="40" height="40" />
            </div>
            <div className="row justify-content-center">
              <div className="col-12 col-sm-10 col-md-8">
                <div className="heading mt-2 mt-md-3">
                  <h2 className="mb-0 text-center">Welcome back</h2>
                  <p className="mt-2 mt-md-3 text-center">
                    Enter Email and password to access your Account
                  </p>
                </div>

                <form onSubmit={handlesignup}>
                  <div className="mb-2">
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

                  <div className="mb-2">
                    <label className="form-label">Enter Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember Me
                      </label>
                    </div>

                    <Link to="/resetpage" className="forgot-password-link">
                      Forgot Password?
                    </Link>
                  </div>

                  <div className="d-flex justify-content-center align-items-center mt-3 mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary form-control"
                    >
                      <i className="fas fa-sign-in-alt me-2"></i> Sign Up
                    </button>
                  </div>
                </form>
                <div className="d-flex justify-content-center mt-3">
                  <Link to={"/partnership"} style={{ textDecoration: "none" }}>
                    {" "}
                    <button className="btn btn-white">
                      <img
                        src="./supplier.png"
                        className="me-2"
                        alt=""
                        style={{ width: "25px" }}
                      />{" "}
                      Become a supplier or Staff
                    </button>
                  </Link>
                </div>
                <div className="text-center mt-3">
                  Already have an account?{" "}
                  <Link to="/login" className="signup-link">
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Signup;
