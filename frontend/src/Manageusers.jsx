import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [columns, setColumns] = useState([]);

  // Fetch all users or users by role
  const fetchUsers = async () => {
    try {
      // Check for admin role
      if (localStorage.getItem("userRole") !== "admin") {
        toast.error("You are not authorized to view this page");
        return;
      }

      setLoading(true);

      // Build query parameters
      const query = roleFilter ? `role=${roleFilter}` : "";

      // Make API request
      const response = await axios.get(`https://inventorymanagmentsystembackend.onrender.com/admin/allusers?${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      });

      // Log and update users
      console.log("data response", response);
      setUsers(response?.data?.data || []);

      // Define column mappings
      const columnMappings = {
        supplier: [
          "S.no",
          "Name",
          "Email",
          "Role",
          "Status",
          "GST Number",
          "Company Details",
        ],
        staff: ["S.no", "Name", "Email", "Role", "Status", "Department"],
        user: ["S.no", "Name", "Email", "Role", "Status"],
        default: ["S.no", "Name", "Email", "Role", "Status"],
      };

      // Set columns based on role filter
      setColumns(columnMappings[roleFilter] || columnMappings.default);
    } catch (error) {
      // Display error message
      console.error("Error fetching users:", error);
      toast.error(
        error?.response?.data?.message || error.message || "An error occurred"
      );
    } finally {
      // Ensure loading state is reset
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(`https://inventorymanagmentsystembackend.onrender.com/admin/approve/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }, // Authorization header
      });

      // Log success and update users' state
      console.log("User approved successfully:", response.data);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isActive: true } : user
        )
      );
    } catch (error) {
      // Handle errors gracefully
      console.error(
        "Error approving user:",
        error.response?.data || error.message
      );
    }
  };

  // suspend user
  const handlesupsend = async (userId) => {
    try {
      axios
        .get(`https://inventorymanagmentsystembackend.onrender.com/admin/suspend/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        .then((res) => {
          console.log(res.data.data);
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === userId ? { ...user, isActive: false } : user
            )
          );
        });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlereject = (userId) => {
    try {
      axios
        .delete(`https://inventorymanagmentsystembackend.onrender.com/admin/reject/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        .then((res) => {
          console.log(res.data.data);
          if (res.status === 200) {
            toast.success("User Rejected successfully");
            setUsers(
              (prevUsers) => prevUsers.filter((user) => user._id !== userId),
              toast.success("Supplier Rejected successfully")
            );
          } else {
            toast.error("Unable to Complete your request");
          }
        });
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch users whenever roleFilter changes
  useEffect(() => {
    fetchUsers();
  }, [roleFilter]); // Added roleFilter to dependencies so data re-fetches when it changes

  return (
    <div style={{ margin: "100px 20px" }}>
      <h1 className="mb-4">Manage Users</h1>

      {/* Role Filter Dropdown */}
      <select
        className="form-select mb-4"
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        style={{ maxWidth: "200px" }}
      >
        <option value="">All Users</option>
        <option value="user">Local Users</option>
        <option value="supplier">Suppliers</option>
        <option value="staff">Staff</option>
      </select>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.username || "N/A"}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.role === "supplier"
                    ? user.isActive
                      ? "Approved"
                      : "Pending"
                    : user.isActive
                    ? "Active"
                    : "Inactive"}
                </td>
                {roleFilter === "supplier" && (
                  <>
                    <td>{user.supplierDetails?.gstNumber || "N/A"}</td>
                    <td>{user.supplierDetails?.companyName || "N/A"}</td>
                  </>
                )}
                {roleFilter === "staff" && (
                  <>
                    <td>{user.department || "inventary Management"}</td>
                  </>
                )}
                <td>
                  {user.role === "supplier" ? (
                    user.isActive ? (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handlesupsend(user._id)}
                      >
                        Suspend
                      </button>
                    ) : (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleApprove(user._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => (
                            handlereject(user._id),
                            alert("Are you sure you want to reject this user?")
                          )}
                        >
                          Reject
                        </button>
                      </>
                    )
                  ) : user.isActive ? (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => alert("Deactivate logic here")}
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => alert("Activate logic here")}
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ToastContainer />
    </div>
  );
}

export default ManageUsers;
