import axios from "axios";
import { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";

function Setting() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: { country: "", state: "", city: "", zipCode: "" },
    profileimg: null,
    authType: "",
    userid: "",
  });

  const [editableField, setEditableField] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("address.")) {
      // Update nested address fields
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name.split(".")[1]]: value },
      }));
    } else {
      // Update top-level fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // For previewing the image
      setFormData((prev) => ({
        ...prev,
        profileimg: file, // Store the file, not Base64
      }));
    }
  };
  const defaultimg = "user.png";

  const handleimgremove = () => {
    setPreviewImage(defaultimg);
    // console.log(formData);
    setFormData((prev) => ({
      ...prev,
      profileimg: defaultimg,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object
    const uploadData = new FormData();
    console.log(formData);
    uploadData.append("userid", formData.userid);
    uploadData.append("username", formData.username);
    uploadData.append("phone", formData.phone);
    uploadData.append("address", JSON.stringify(formData.address));
    // console.log("address",JSON.stringify(formData.address));
    // console.log("address",formData.address);
    if (formData.profileimg) {
      uploadData.append("profileimg", formData.profileimg);
    }
    console.log("Data send in backend", uploadData);

    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.put("https://inventorymanagmentsystembackend.onrender.com/api/user/update", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        toast.success("User updated successfully");
        console.log("Response:", res.data);

        const { country, state, city, zipCode } =
          res.data.apiData.address || {};

        setFormData({
          address: { country, state, city, zipCode },
          username: res.data.apiData.username,
          email: res.data.apiData.email,
          phone: res.data.apiData.phone || "",
          profileimg: res.data.apiData.profileimg.replace(/["']/g, ""),
          authType: res.data.apiData.authType,
          userid: res.data.apiData._id,
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countryList = Country.getAllCountries();
        setCountries(countryList);

        const loginemail = localStorage.getItem("loginemail");
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`https://inventorymanagmentsystembackend.onrender.com/api/user/userfetch/${loginemail}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Data", res);
        const { country, state, city, zipCode } =
          res.data.apiData.address || {};

        setFormData({
          address: { country, state, city, zipCode },
          username: res.data.apiData.username,
          email: res.data.apiData.email,
          phone: res.data.apiData.phone || "",
          profileimg: res.data.apiData.profileImg.replace(/["']/g, ""),
          authType: res.data.apiData.authType,
          userid: res.data.apiData._id,
        });

        // Populate states and cities dynamically based on fetched data
        if (country) setStates(State.getStatesOfCountry(country));
        if (state) setCities(City.getCitiesOfState(country, state));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, country, state: "", city: "" },
    }));
    const states = State.getStatesOfCountry(country);
    setStates(states);
    setCities([]);
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, state, city: "" },
    }));
    const cities = City.getCitiesOfState(formData.address.country, state);
    setCities(cities);
  };

  return (
    <div className="container-fluid" style={{ marginTop: "100px" }}>
      <div className="row">
        <div className="col-md-12">
          <h2 className="mb-4">Your Profile Settings</h2>
          <p>
            View and manage personal settings and sessions for this Account.
          </p>
        </div>
      </div>
      <div className="row rounded shadow bg-light p-4">
        <div className="col-md-4 text-center">
          <img
            src={previewImage || formData.profileimg}
            alt="Profile"
            className="rounded-circle mb-3"
            style={{ width: "150px", height: "150px" }}
          />
        </div>
        <div className="col-md-8">
          <form onSubmit={handleSubmit} className="p-3 border rounded bg-white">
            {formData.authType === "google" || formData.authType === "fb" ? (
              <>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <p>{formData.username}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <p>{formData.email}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label">Auth Provider</label>
                  <p>
                    {formData.authType === "google" ? "Google" : "Facebook"}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Username</label>
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="form-control"
                        readOnly={editableField !== "username"}
                      />
                      <button
                        type="button"
                        className={`btn btn-sm btn-secondary ms-2 ${
                          editableField === "username" ? "btn-success" : ""
                        }`}
                        onClick={() =>
                          setEditableField(
                            editableField === "username" ? "" : "username"
                          )
                        }
                      >
                        {editableField === "username" ? (
                          <i className="bi bi-save"></i>
                        ) : (
                          <i className="bi bi-pencil-square"></i>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <div className="d-flex align-items-center">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        readOnly
                        // required
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary ms-2"
                        onClick={() =>
                          setEditableField(
                            editableField === "email" ? "" : "email"
                          )
                        }
                      >
                        {editableField === "email" ? (
                          <i className="bi bi-save"></i>
                        ) : (
                          <i className="bi bi-pencil-square"></i>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <div className="d-flex align-items-center">
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control"
                      readOnly={editableField !== "phone"}
                      pattern="^\d{10}$"
                      maxLength="10" // Prevent input beyond 10 digits
                    />

                    <button
                      type="button"
                      className={`btn btn-sm btn-secondary ms-2 ${
                        editableField === "phone" ? "btn-success" : ""
                      }`}
                      onClick={() =>
                        setEditableField(
                          editableField === "phone" ? "" : "phone"
                        )
                      }
                    >
                      {editableField === "phone" ? (
                        <i className="bi bi-save"></i>
                      ) : (
                        <i className="bi bi-pencil-square"></i>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  {/* Country Field */}
                  <label className="form-label">Country</label>
                  <div className="d-flex align-items-center">
                    <select
                      name="address.country"
                      value={formData.address.country || ""}
                      onChange={handleCountryChange}
                      className="form-select"
                      disabled={editableField !== "country"} // Allow editing only when active
                    >
                      <option value="">{formData.address.country || ""}</option>
                      {countries.map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className={`btn btn-sm btn-secondary ms-2 ${
                        editableField === "country" ? "btn-success" : ""
                      }`}
                      onClick={() =>
                        setEditableField(
                          editableField === "country" ? "" : "country"
                        )
                      }
                    >
                      {editableField === "country" ? (
                        <i className="bi bi-save"></i>
                      ) : (
                        <i className="bi bi-pencil-square"></i>
                      )}
                    </button>
                  </div>
                </div>

                <div className="row">
                  {/* State Field */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label">State</label>
                    <div className="d-flex align-items-center">
                      <select
                        name="address.state"
                        value={formData.address.state || ""}
                        onChange={handleStateChange}
                        className="form-select"
                        disabled={editableField !== "state"} // Allow editing only when active
                      >
                        <option value="">{formData.address.state || ""}</option>
                        {states.map((state) => (
                          <option key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className={`btn btn-sm btn-secondary ms-2 ${
                          editableField === "state" ? "btn-success" : ""
                        }`}
                        onClick={() =>
                          setEditableField(
                            editableField === "state" ? "" : "state"
                          )
                        }
                      >
                        {editableField === "state" ? (
                          <i className="bi bi-save"></i>
                        ) : (
                          <i className="bi bi-pencil-square"></i>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* City Field */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label">City</label>
                    <div className="d-flex align-items-center">
                      <select
                        name="address.city"
                        value={formData.address.city || ""}
                        onChange={handleChange}
                        className="form-select"
                        disabled={editableField !== "city"} // Allow editing only when active
                      >
                        <option value="">{formData.address.city || ""}</option>
                        {cities.map((city) => (
                          <option key={city.isoCode} value={city.isoCode}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className={`btn btn-sm btn-secondary ms-2 ${
                          editableField === "city" ? "btn-success" : ""
                        }`}
                        onClick={() =>
                          setEditableField(
                            editableField === "city" ? "" : "city"
                          )
                        }
                      >
                        {editableField === "city" ? (
                          <i className="bi bi-save"></i>
                        ) : (
                          <i className="bi bi-pencil-square"></i>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* ZIP Code Field */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label">ZIP Code</label>
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        name="address.zipCode"
                        value={formData.address.zipCode || ""}
                        onChange={handleChange}
                        className="form-control"
                        readOnly={editableField !== "zipCode"} // Allow editing only when active
                        pattern="^\d{6}$"
                        maxLength="6"
                        title="Please enter a valid 6-digit ZIP code"
                        required
                      />
                      <button
                        type="button"
                        className={`btn btn-sm btn-secondary ms-2 ${
                          editableField === "zipCode" ? "btn-success" : ""
                        }`}
                        onClick={() =>
                          setEditableField(
                            editableField === "zipCode" ? "" : "zipCode"
                          )
                        }
                      >
                        {editableField === "zipCode" ? (
                          <i className="bi bi-save"></i>
                        ) : (
                          <i className="bi bi-pencil-square"></i>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Profile Image Upload */}
                <div className="mb-3">
                  <label className="form-label">Profile Image</label>
                  <input
                    type="file"
                    onChange={handleImagePreview}
                    className="form-control"
                  />
                </div>

                <img
                  src={previewImage || formData.profileimg}
                  className="mb-4 rounded border p-2 ml-2"
                  style={{ width: "100px" }}
                  alt="Profile Preview"
                />

                {/* Stylish Remove Button */}
                <div className="mx-3 mb-3">
                  <button
                    type="button"
                    className="btn btn-outline-danger d-flex align-items-center"
                    onClick={handleimgremove}
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Update Profile
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Setting;
