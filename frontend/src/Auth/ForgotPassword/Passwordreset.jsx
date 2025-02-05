import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

function Passwordreset() {
  const [tempmail, settempmail] = useState("");
  const [password, setPassword] = useState({
    newpassword: "",
    cnewpassword: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedTempdata = localStorage.getItem("tempdata");
    if (storedTempdata) {
      settempmail(storedTempdata);
    }
    console.log(tempmail);
  }, [tempmail]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const { newpassword, cnewpassword } = password;

    if (!newpassword || !cnewpassword) {
      toast.error("Please fill in all fields!");
      return;
    }

    if (newpassword !== cnewpassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // const data = { newpassword };

    try {
      const res = await axios.post("https://inventorymanagmentsystembackend.onrender.com/auth/reset-password", {
        newpassword: newpassword,
        email: tempmail,
      }); 

      if (res.status === 200 && res.data.message) {
        localStorage.removeItem("tempdata");
        toast.success(res.data.message, {
          onClose: () => navigate("/"), 
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
    }
  };

  return (
    <div className="login-page">
      <div className="container-fluid d-flex">
        <div className="left-side">{/* Left side for background image */}</div>
        <div className="right-side d-flex">
          <section id="login" className=" p-4 login-container">
            <div className="text-center mb-4">
              <img src="/logo.png" alt="Logo" width="40" height="40" />
            </div>
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="heading mt-3">
                  <h2 className="mb-0 text-center">Password Reset</h2>
                  <p className="mt-3 text-center">
                    Set new password to access your account
                  </p>
                </div>

                <form onSubmit={handleResetPassword}>
                  <div className="mb-4">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password.newpassword}
                      onChange={(e) =>
                        setPassword({
                          ...password,
                          newpassword: e.target.value,
                        })
                      }
                      placeholder="Enter your new password"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="text"
                      className="form-control"
                      value={password.cnewpassword}
                      onChange={(e) =>
                        setPassword({
                          ...password,
                          cnewpassword: e.target.value,
                        })
                      }
                      placeholder="Confirm your new password"
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
                    Already have an account?{" "}
                    <Link to="/login" className="signup-link">
                      Login
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

export default Passwordreset;
