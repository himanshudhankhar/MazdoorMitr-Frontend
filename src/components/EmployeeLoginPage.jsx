import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import "./EmployeeLoginPage.css";

const EmployeeLogin = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 10) {
      alert("Please enter a valid phone number.");
      return;
    }
    try {
      setLoading(true);
      await axiosInstance.post("/api/users/send-otp/employee-login", { phone });
      setOtpSent(true);
      alert("OTP sent to your mobile.");
    } catch (err) {
      console.error("Failed to send OTP:", err);
      alert(err?.response?.data?.error || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndLogin = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      alert("Please request an OTP first.");
      return;
    }
    if (!otp || otp.trim().length < 4) {
      alert("Please enter a valid OTP.");
      return;
    }
    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/users/verify-otp/employee-login", {
        phone,
        otp,
      });

      const token = res?.data?.token;
      if (!token) {
        alert("Login failed: token not received.");
        return;
      }

      // Persist auth
      localStorage.setItem("authToken", token);
      localStorage.setItem("userType", "Employee");
      if (res?.data?.employee?.id) {
        localStorage.setItem("userId", res.data.employee.id);
      }

      alert("Login successful!");
      navigate("/employee-dashboard");
    } catch (err) {
      console.error("OTP verification failed:", err);
      alert(err?.response?.data?.error || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-login">
      <header className="employee-login-header-login">
        <h1>Employee Portal</h1>
      </header>

      <div className="employee-login-container">
        <h2>Employee Login</h2>

        <form onSubmit={verifyAndLogin}>
          <div className="employee-login-form-group">
            <label htmlFor="phone">Employee Phone:</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone"
              required
            />
          </div>

          <button
            type="button"
            className="employee-login-btn"
            style={{ marginBottom: "10px" }}
            onClick={sendOtp}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP on Mobile"}
          </button>

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

          <button type="submit" className="employee-login-btn" disabled={loading || !otpSent}>
            {loading ? "Verifying..." : "Login"}
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
