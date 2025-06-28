import React, { useState } from "react";
import "./AdminLoginPage.css";
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post('/api/users/send-otp/admin-login', { passcode: username });
      console.log(response.data);
      alert("OTP sent successfully to registered mobile (check console in dev mode)");
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please check passcode.");
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post('/api/users/verify-otp/admin-login', { otp });
      console.log('✅ Login successful:', response.data);
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userType", "admin");
      navigate('/admin-dashboard');
    } catch (error) {
      console.error("❌ OTP verification failed:", error);
      alert("Invalid or expired OTP. Please try again.");
    }
  };

  return (
    <div className="admin-login">
      <header className="admin-login-header">
        <h1>Admin Portal</h1>
      </header>
      <div className="admin-login-container">
        <h2>Admin Login</h2>
        <form>
          <div className="admin-login-form-group">
            <label htmlFor="passcode">Passcode:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin passcode"
              required
            />
          </div>
          <button onClick={handleSendOtp} className="admin-login-btn" style={{marginBottom: '10px'}}>
            Send OTP on Mobile
          </button>

          {otpSent && (
            <>
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
              <button onClick={handleLogin} className="admin-login-btn">
                Login
              </button>
            </>
          )}
        </form>
      </div>
      <footer className="admin-login-footer-login">
        <p>&copy; 2025 Admin Portal. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AdminLogin;
