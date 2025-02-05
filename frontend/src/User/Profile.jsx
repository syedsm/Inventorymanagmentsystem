import axios from "axios";
import { useState, useEffect } from "react";

function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        console.log("Response:", response);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <div className="text-center text-primary">Loading...</div>;
  }

  return (
    <div className="container-fluid" style={{ paddingTop: "120px" }}>
      <div className="row" style={{ height: "50vh" }}>
        {/* Profile Header Section */}
        <div className="col-md-6 text-center mb-4 mb-md-0">
          <img
            className="rounded-circle img-fluid mb-3"
            src={userData.profileImg}
            alt="User Avatar"
            style={{
              maxWidth: "120px",
              maxHeight: "120px",
              border: "10px solid #f1f1f1",
            }}
          />
          <h2 className="mb-2">{userData.username}</h2>
          <p className="text-muted mb-4">{userData.email}</p>
        </div>

        {/* Profile Details Section */}
        <div className="col-md-6">
          <div className="border-0">
            <div className="card-body">
              <h3 className="card-title mb-4 text-center">Profile Details</h3>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <strong>Auth Provider:</strong> {userData.authType}
                </li>
                <li className="mb-2">
                  <strong>Role:</strong> {userData.role}
                </li>
                <li className="mb-2">
                  <strong>Account Created:</strong>{" "}
                  {new Date(userData.createdAt).toLocaleDateString()}
                </li>
                <li className="mb-2">
                  <strong>Last Updated:</strong>{" "}
                  {new Date(userData.updatedAt).toLocaleDateString()}
                </li>
                <li className="mb-2">
                  <strong>Account Status:</strong>{" "}
                  {userData.isActive ? "Active" : "Inactive"}
                </li>

                {/* Conditional Rendering */}
                {userData.phone && (
                  <li className="mb-2">
                    <strong>Phone:</strong> {userData.phone}
                  </li>
                )}
                {userData.address && (
                  <li className="mb-2">
                    <strong>Address:</strong> {userData.address}
                  </li>
                )}
                {userData.bio && (
                  <li className="mb-2">
                    <strong>Bio:</strong> {userData.bio}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
