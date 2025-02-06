import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { auth } from "../Auth/Firebaseauth";
// import { signInWithPopup, getAuth, GoogleAuthProvider } from "firebase/auth";
import axios from "axios";
import { Contextapi } from "../contexts/Authcontext";
import { decodeToken } from "react-jwt";

import {
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";

import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setloginpopup, loginpopup, setloginemail, setUserRole } =
    useContext(Contextapi);
  const { setLogin } = useContext(Contextapi);
  const Navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill out all fields!");
      return;
    }

    const data = { email, password };

    try {
      const res = await axios.post(
        "/api/auth/login",
        data
      );
      console.log("data recived", res);
      const decodedTokendata = decodeToken(res.data.token);
      console.log("Decoded token:", decodedTokendata);
      localStorage.setItem("loginemail", decodedTokendata.email);
      localStorage.setItem("authToken", decodedTokendata.token);
      localStorage.setItem("userRole", decodedTokendata.role);
      setUserRole(decodedTokendata.role);
      setloginemail(decodedTokendata.email);
      setLogin(res.data.token);
      setloginpopup("true");
      localStorage.setItem("showLoginPopup", "true");

      if (
        decodedTokendata.role === "admin" ||
        decodedTokendata.role === "staff" ||
        decodedTokendata.role === "supplier"
      ) {
        Navigate("/dashboard");
      } else {
        Navigate("/home");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred during login. Please try again.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      // console.log("data recived", user);

      // Call the backend API with the Google access token
      const res = await axios.post(
        "/api/auth/Googlelogin",
        {
          data: { accessToken: user.accessToken },
        }
      );

      // // console.log("data recived",res);

      if (res.status === 200 || res.status === 201) {
        const decodedTokendata = decodeToken(res.data.token);
        // console.log("res", decodedTokendata);
        localStorage.setItem("authToken", res.data.token);
        // const { email } = res.data;
        localStorage.setItem("loginemail", decodedTokendata.email);
        setUserRole(localStorage.setItem("userRole", decodedTokendata.role));
        setloginemail(decodedTokendata.email);

        // setloginpopup("true");
        // localStorage.setItem("showLoginPopup", "true");
        setLogin(res.data.token);
        Navigate("/home");
      }
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        toast.error(
          "Account already exists another sign-in provider, you can try different email"
        );
      } else {
        console.error("Error during Google login:", error);
        toast.error("An error occurred during Google login. Please try again.");
      }
    }
  };

  const handleFBLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new FacebookAuthProvider());
      const accessToken = result.user.accessToken;

      // Call the backend API with the Facebook access token
      const res = await axios.post(
        "/api/auth/FBlogin",
        {
          data: { accessToken },
        }
      );

      if (res.data.conflict) {
        toast.error(res.data.message); // Show conflict toast if user exists
        return;
      }

      // If successful login (status 200 or 201)
      if (res.status === 200 || res.status === 201) {
        const decodedTokendata = decodeToken(res.data.token);
        const receivedToken = res.data.token;
        localStorage.setItem("authToken", receivedToken);
        const { email } = res.data;
        localStorage.setItem("loginemail", decodedTokendata.email);
        setUserRole(localStorage.setItem("userRole", decodedTokendata.role));
        setloginemail(email);
        // setloginpopup("true");
        // localStorage.setItem("showLoginPopup", "true");
        setLogin(receivedToken);
        Navigate("/home");
      }
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        toast.error(
          "Account already exists another sign-in provider, you can try different email"
        );
      } else {
        console.error("Error during Facebook login:", error);
        toast.error(
          "An error occurred during Facebook login. Please try again."
        );
      }
    }
  };

  // useEffect(() => {
  //   console.log("logs loginpopuop", loginpopup);
  //   if (loginpopup === "true") {
  //     toast.success("User Logout Successfully");
  //     setloginpopup("false");
  //     localStorage.setItem("showLoginPopup", "false");
  //   }
  // }, [loginpopup, setloginpopup]);

  // const showToast = localStorage.getItem("showLoginPopup");

  useEffect(() => {
    // Show the toast notification if redirected after logout
    if (loginpopup === "true") {
      // console.log("logs", loginpopup);
      toast.success("You have logged out successfully!");
      localStorage.setItem("showLoginPopup", "false");
      setloginpopup("false");
    }
  }, [loginpopup, setloginpopup]);

  // useEffect(() => {
  //   // Check if "showLoginPopup" is set in localStorage
  //   const showPopup = localStorage.getItem("showLoginPopup");

  //   if (showPopup === "true") {
  //     // Show toast for logout success
  //     toast.success("User Logout Successfully");

  //     // Reset "showLoginPopup" in localStorage
  //     setloginpopup(localStorage.setItem("showLoginPopup", "false"));

  //     // Also reset in context to prevent unwanted re-renders
  //     // setloginpopup("false");
  //   }
  // }, [setloginpopup]);

  return (
    <div className="login-page">
      <div className="container-fluid d-flex flex-column flex-md-row">
        <div className="left-side d-none d-md-block col-md-6">
          {/* Left side for background image */}
        </div>
        <div className="right-side d-flex align-items-center col-12 col-md-6">
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

                <form onSubmit={handleLogin}>
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
                      <i className="fas fa-sign-in-alt me-2"></i> Sign In
                    </button>
                  </div>
                </form>

                {/* Google login button */}
                <div className="d-flex justify-content-center mt-3">
                  <button className="btn btn-white" onClick={handleGoogleLogin}>
                    <img
                      src="./google_2504739.png"
                      className="me-2"
                      alt=""
                      style={{ width: "25px" }}
                    />{" "}
                    Sign in with Google
                  </button>
                </div>

                {/* Facebook login button */}
                <div className="d-flex justify-content-center mt-3">
                  <button className="btn btn-white" onClick={handleFBLogin}>
                    <img
                      src="./facebook_5968764.png"
                      className="me-2"
                      alt=""
                      style={{ width: "25px" }}
                    />
                    Login with Facebook
                  </button>
                </div>

                <div className="text-center mt-3">
                  Don’t have an account?{" "}
                  <Link to="/signup" className="signup-link">
                    Sign Up
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

export default Login;
