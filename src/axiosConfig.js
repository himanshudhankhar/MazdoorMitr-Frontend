// src/utils/axiosInstance.js
import axios from "axios";

const isLocalhost = window.location.hostname === "localhost";

const axiosInstance = axios.create({
  baseURL: isLocalhost
    ? "http://localhost:5000/mazdoormitr-f4413/us-central1/default"
    : "/", // Firebase Hosting rewrites to cloud function
  withCredentials: false, // or true if you're using cookies
});

// Add interceptor to attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
