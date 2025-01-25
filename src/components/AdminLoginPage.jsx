import React, { useState } from "react";
import "./AdminLoginPage.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ username, otp });
    // Add login logic here
  };

  return (
    <div className="admin-login">
      <header className="admin-login-header">
        <h1>Admin Portal</h1>
      </header>
      <div className="admin-login-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="admin-login-form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="admin-login-form-group">
            <label htmlFor="otp">OTP:</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
          </div>
          <button type="submit" className="admin-login-btn">
            Login
          </button>
        </form>
      </div>
      <footer className="admin-login-footer-login">
        <p>&copy; 2025 Admin Portal. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AdminLogin;
