// const handleLogout = () => {
//   try {
//     // 🔐 Remove auth-related data
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("accountType");
//     localStorage.removeItem("userType");
//     localStorage.removeItem("shopId");

//     // 💳 Optional: clear Razorpay data
//     localStorage.removeItem("rzp_checkout_anon_id");
//     localStorage.removeItem("rzp_device_id");
//     localStorage.removeItem("rzp_stored_checkout_id");

//     // ❗ Keep consent.mitr (optional)
//     // localStorage.removeItem("consent.mitr"); // only if you want reset

//     // 🧹 Remove axios auth header if set
//     delete axiosInstance.defaults.headers.Authorization;

//     // 🔁 Redirect
//     window.location.href = "/login";

//   } catch (error) {
//     console.error("Logout error:", error);
//   }
// };

import React from "react";
import { useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance"; // adjust path if needed
import axiosInstance from "../axiosConfig";

const Logout = () => {
  const navigate = useNavigate();

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
    <button onClick={handleLogout} style={styles.button}>
      Logout
    </button>
  );
};

export default Logout;

const styles = {
  button: {
    padding: "8px 16px",
    backgroundColor: "#ff4d4f",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};