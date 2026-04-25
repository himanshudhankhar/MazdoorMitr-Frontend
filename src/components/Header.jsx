import React from "react";
import { NavLink } from "react-router-dom";
import "./header.css";
import { useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance"; // adjust path if needed
import axiosInstance from "../axiosConfig";

export default function Header() {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const handleLogout = () => {
    try {
      // 🔐 Remove auth-related data
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("accountType");
      localStorage.removeItem("userType");
      localStorage.removeItem("shopId");

      // 💳 Remove Razorpay-related keys (optional but good for clean reset)
      localStorage.removeItem("rzp_checkout_anon_id");
      localStorage.removeItem("rzp_device_id");
      localStorage.removeItem("rzp_stored_checkout_id");

      // ❗ Optional: keep or remove consent
      // localStorage.removeItem("consent.mitr");

      // 🧹 Remove axios auth header if set globally
      if (axiosInstance?.defaults?.headers) {
        delete axiosInstance.defaults.headers.Authorization;
      }

      // 🔁 Navigate to home page
      navigate("/");

    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <header className="header">
      <div className="header-brand">
        <h1>MazdoorMitr</h1>
      </div>
      <nav className="header-nav">
        <NavLink to="/app/home" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
        {/* <NavLink to="/app/profile" className={({isActive}) => isActive ? "active" : ""}>Profile</NavLink> */}
        {userType !== "BusinessOwner" && (
          <NavLink to="/app/profile" className={({ isActive }) => isActive ? "active" : ""}>
            Profile
          </NavLink>
        )}

        <NavLink to="/app/wallet" className={({ isActive }) => isActive ? "active" : ""}>Wallet</NavLink>

        {userType == "BusinessOwner" && (
          <NavLink to="/app/shop-dashboard" className={({ isActive }) => isActive ? "active" : ""}>
            Shops
          </NavLink>
        )}

        {userType !== "BusinessOwner" && (
          <NavLink to="/app/shops" className={({ isActive }) => isActive ? "active" : ""}>
            Shops
          </NavLink>
        )}


        <NavLink to="/app/marketplace" className={({ isActive }) => isActive ? "active" : ""}>Marketplace</NavLink>
        <a onClick={handleLogout}>Logout</a>
      </nav>
    </header>
  );
}
