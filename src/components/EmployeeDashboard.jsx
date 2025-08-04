import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig"; // Your Axios instance
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          alert("User ID not found in local storage. Please login again.");
          navigate("/employee-login");
          return;
        }

        const res = await axiosInstance.post(
          "/api/users/protected/employees/fetch-by-id",
          { id: userId }
        );

        if (res.data.success) {
          setEmployee(res.data.employee);
        } else {
          alert(res.data.message || "Failed to fetch employee data.");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        alert("Error fetching employee data.");
      }
    };

    fetchEmployeeData();
  }, [navigate]);

  return (
    <div className="employee-dashboard-container">
      {/* Header */}
      <header className="employee-dashboard-header">
        <h1>Employee Dashboard</h1>
      </header>

      {/* Profile Section */}
      <section className="employee-dashboard-profile-section">
        {employee ? (
          <div className="employee-dashboard-profile-card">
            <img
              src={employee?.profileImageUrl || "/default-profile.png"}
              alt="Employee"
              className="employee-dashboard-profile-image"
            />
            <div className="employee-dashboard-profile-details">
              <h2>{employee?.name || "N/A"}</h2>
              <p>
                <strong>Address:</strong> {employee?.address || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {employee?.phone || "N/A"}
              </p>
              <p>
                <strong>Joining Date:</strong>{" "}
                {employee?.createdAt
                  ? new Date(employee.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        ) : (
          <p>Loading employee data...</p>
        )}
      </section>

      {/* Actions Section */}
      <section className="employee-dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="employee-dashboard-action-buttons">
          <button
            onClick={() => navigate("/registered-labourers-by-employee")}
            className="employee-dashboard-btn"
          >
            View Registered Labourers
          </button>
          <button
            onClick={() => navigate("/register-labourers-by-employee")}
            className="employee-dashboard-btn"
          >
            Register Labourer
          </button>
          <button
            onClick={() => navigate("/edit-labourer-by-employee")}
            className="employee-dashboard-btn"
          >
            Edit Labourer Profile
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="employee-dashboard-footer">
        <p>&copy; 2025 MazdoorMitr. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default EmployeeDashboard;
