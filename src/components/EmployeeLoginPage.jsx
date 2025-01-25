import React, { useState } from "react";
import "./EmployeeLoginPage.css";

const EmployeeLogin = () => {
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ name, otp });
    // Add employee login logic here
  };

  return (
    <div className="employee-login">
      <header className="employee-login-header-login">
        <h1>Employee Portal</h1>
      </header>
      <div className="employee-login-container">
        <h2>Employee Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="employee-login-form-group">
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
          <button type="submit" className="employee-login-btn">
            Login
          </button>
        </form>
      </div>
      <footer className="employee-login-footer-login">
        <p>&copy; 2025 Employee Portal. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default EmployeeLogin;
