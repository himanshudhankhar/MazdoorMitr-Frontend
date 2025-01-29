import React from "react";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const handleRedirect = (path) => {
    // Add routing logic here
    console.log(`Redirect to: ${path}`);
  };

  return (
    <div className="employee-dashboard">
      <header className="employee-login-header-login">
        <h1>Employee Dashboard</h1>
      </header>

      <div className="dashboard-container-employee-dashboard">
        <h2>Welcome</h2>
        <div className="action-buttons-employee-dashboard">
          <button onClick={() => handleRedirect("/add-labourer")} className="dashboard-btn-employee-dashboard">
            Add Labourer
          </button>
          <button onClick={() => handleRedirect("/modify-labourer")} className="dashboard-btn-employee-dashboard">
            Search & Modify Labourer Data
          </button>
          <button onClick={() => handleRedirect("/add-employer")} className="dashboard-btn-employee-dashboard">
            Add Employer
          </button>
          <button onClick={() => handleRedirect("/modify-employer")} className="dashboard-btn-employee-dashboard">
            Search & Modify Employer Data
          </button>
          <button onClick={() => handleRedirect("/report-profiles-requests")} className="dashboard-btn-employee-dashboard">
            Report Profiles Requests
          </button>
          <button onClick={() => handleRedirect("/mediation-requests")} className="dashboard-btn-employee-dashboard">
            Mediation Requests
          </button>
          <button onClick={() => handleRedirect("/profile-transactions")} className="dashboard-btn-employee-dashboard">
            Profilewise Transactions 
          </button>
          <button onClick={() => handleRedirect("/incomplete-profiles")} className="dashboard-btn-employee-dashboard">
            Track Incomplete Profiles 
          </button>
        </div>
      </div>

      <footer className="footer-employee-dashboard">
        <p>&copy; 2025 Employee Dashboard. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default EmployeeDashboard;