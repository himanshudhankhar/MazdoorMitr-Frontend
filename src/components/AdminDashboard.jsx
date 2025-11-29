import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [labourerCount, setLabourerCount] = useState(null);
  const [employerCount, setEmployerCount] = useState(null);

  const handleRedirect = (path) => {
    const fullUrl = `${window.location.origin}${path}`;
    window.open(fullUrl, "_blank");
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const labourerRes = await axiosInstance.get("/api/users/protected/get-total-labourers");
        if (labourerRes.data?.totalLabourers !== undefined) {
          setLabourerCount(labourerRes.data.totalLabourers);
        }

        const employerRes = await axiosInstance.get("/api/users/protected/get-total-employers");
        if (employerRes.data?.totalEmployers !== undefined) {
          setEmployerCount(employerRes.data.totalEmployers);
        }
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="admin-dashboard">
      <header className="employee-login-header-login">
        <h1>Admin Dashboard</h1>
      </header>

      <div className="dashboard-container-admin-dashboard">
        <h2>Welcome, Admin</h2>

        <div className="analytics-section">
          <h3>Dashboard Analytics</h3>
          <div className="analytics-cards">
            <div className="analytics-card">
              <h4>Total Labourers</h4>
              <p>{labourerCount !== null ? labourerCount : "Loading..."}</p>
            </div>

            <div className="analytics-card">
              <h4>Total Employers</h4>
              <p>{employerCount !== null ? employerCount : "Loading..."}</p>
            </div>

            <div className="analytics-card">
              <h4>Total Active Employees</h4>
              <p>15</p>
            </div>

            <div className="analytics-card">
              <h4>Total Transactions (Date Wise)</h4>
              <button onClick={() => handleRedirect("/all-transactions")} className="view-details-btn">
                View Details
              </button>
            </div>

            <div className="analytics-card">
              <h4>Total Mediations (Date Wise)</h4>
              <button onClick={() => handleRedirect("/mediations-datewise")} className="view-details-btn">
                View Details
              </button>
            </div>

            <div className="analytics-card">
              <h4>Labourers Added (Date & Employee Wise)</h4>
              <button onClick={() => handleRedirect("/labourers-added")} className="view-details-btn">
                View Details
              </button>
            </div>

            <div className="analytics-card">
              <h4>Employers Added</h4>
              <button onClick={() => handleRedirect("/employers-added")} className="view-details-btn">
                View Details
              </button>
            </div>
          </div>
        </div>

        <div className="action-buttons-admin-dashboard">
          <button onClick={() => handleRedirect("/add-labourer")} className="dashboard-btn-admin-dashboard">
            Add Labourer
          </button>
          <button onClick={() => handleRedirect("/modify-labourer")} className="dashboard-btn-admin-dashboard">
            Search & Modify Labourer Data
          </button>
          <button onClick={() => handleRedirect("/add-employer")} className="dashboard-btn-admin-dashboard">
            Add Employer
          </button>
          <button onClick={() => handleRedirect("/modify-employer")} className="dashboard-btn-admin-dashboard">
            Search & Modify Employer Data
          </button>
          <button onClick={() => handleRedirect("/add-employee")} className="dashboard-btn-admin-dashboard">
            Add Employee
          </button>
          <button onClick={() => handleRedirect("/modify-employee")} className="dashboard-btn-admin-dashboard">
            Search & Modify Employee Data
          </button>
          <button onClick={() => handleRedirect("/report-profiles-requests")} className="dashboard-btn-admin-dashboard">
            Handle Report Profile Requests
          </button>
          <button onClick={() => handleRedirect("/mediation-requests")} className="dashboard-btn-admin-dashboard">
            Mediation Requests
          </button>
          <button onClick={() => handleRedirect("/profile-transactions")} className="dashboard-btn-admin-dashboard">
            Profile-wise Transactions
          </button>
          <button onClick={() => handleRedirect("/track-incomplete-transactions")} className="dashboard-btn-admin-dashboard">
            Track Incomplete Transactions
          </button>
          <button onClick={() => handleRedirect("/modify-wallet-balance")} className="dashboard-btn-admin-dashboard">
            Modify Wallet Balance
          </button>
          <button onClick={() => handleRedirect("/block-profiles")} className="dashboard-btn-admin-dashboard">
            Block Profiles
          </button>
          <button onClick={() => handleRedirect("/review-shops")} className="dashboard-btn-admin-dashboard">
            Review Shops
          </button>
        </div>
      </div>

      <footer className="footer-admin-dashboard">
        <p>&copy; 2025 Admin Dashboard. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
