import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function SupplierRegistration() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    companyName: "",
    gstNumber: "",
  });

  const [errors, setErrors] = useState({});
  const Navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Validate form data
  const validate = () => {
    let formErrors = {};
    if (!formData.email) formErrors.email = "Email is required.";
    if (!formData.password || formData.password.length < 8)
      formErrors.password = "Password must be at least 8 characters long.";
    if (!formData.companyName)
      formErrors.companyName = "Company name is required.";
    if (formData.gstNumber && formData.gstNumber.length !== 15)
      formErrors.gstNumber = "GST number must be 15 digits.";
    return formErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const res = await axios.post("https://inventorymanagmentsystembackend.onrender.com/api/auth/supplierregactivation", formData);
      console.log("data", res);
      // console.log(res.data.tempdata);
      if (res.status === 200) {
        localStorage.setItem("tempdata", res.data.tempdata);
        toast.success(res.data.message || "OTP sent successfully!", {
          onClose: () => Navigate("/supplieractivation"),
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
        <div className="right-side d-flex align-items-center col-12 col-md-6">
          <section id="login" className="p-3 p-md-4 login-container w-100">
            <div className="text-center">
              <img src="/logo.png" alt="..." width="40" height="40" />
            </div>
            <div className="row justify-content-center">
              <div className="col-12 col-sm-10 col-md-8">
                <div className="heading mt-2 mt-md-3">
                  <h2 className="mb-0 text-center">Supplier Registration</h2>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Email */}
                  <div className="mt-3">
                    <h6 className="form-label">Email</h6>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                    {errors.email && (
                      <small className="text-danger">{errors.email}</small>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mt-1">
                    <h6 className="form-label">Password</h6>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                    {errors.password && (
                      <small className="text-danger">{errors.password}</small>
                    )}
                  </div>
                  {/* Company Name */}
                  <div className="mt-1">
                    <h6 className="form-label">Company Name</h6>
                    <input
                      type="text"
                      name="companyName"
                      className="form-control"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Enter company name"
                      required
                    />
                    {errors.companyName && (
                      <small className="text-danger">
                        {errors.companyName}
                      </small>
                    )}
                  </div>

                  {/* GST Number */}
                  <div className="mt-1">
                    <h6 className="form-label">GST Number (Optional)</h6>
                    <input
                      type="text"
                      name="gstNumber"
                      className="form-control"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      placeholder="Enter GST number"
                    />
                    {errors.gstNumber && (
                      <small className="text-danger">{errors.gstNumber}</small>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="d-flex justify-content-center align-items-center mt-3 mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary form-control"
                    >
                      Register Supplier
                    </button>
                  </div>
                </form>

                <div className="d-flex justify-content-center mt-3">
                  <Link to="/staffreg" style={{textDecoration:"none"}}>
                    <button className="btn btn-white">
                      <img
                        src="./staff.png"
                        className="me-2"
                        alt=""
                        style={{ width: "25px" }}
                      />
                      Become a  Staff
                    </button>
                  </Link>
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

export default SupplierRegistration;
