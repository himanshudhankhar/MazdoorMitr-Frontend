// // src/utils/axiosInstance.js
// import axios from "axios";

// const isLocalhost = window.location.hostname === "localhost";

// const axiosInstance = axios.create({
//   baseURL: isLocalhost
//     ? "http://localhost:5003"
//     : "/", // Firebase Hosting rewrites to cloud function
//   withCredentials: false, // or true if you're using cookies
// });

// // Add interceptor to attach token to every request
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("authToken");
//     const userType = localStorage.getItem("userType");
//     console.log("x-user-type", userType);
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//       config.headers["x-user-type"] = userType;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default axiosInstance;

// src/utils/axiosInstance.js
import axios from "axios";
import { loaderRef } from "./loaderRef";

const isLocalhost = window.location.hostname === "localhost";

const axiosInstance = axios.create({
  baseURL: isLocalhost
    ? "http://localhost:5003"
    : "/", // Firebase Hosting rewrite
  withCredentials: false,
});

// 🔹 REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {
    // 🔐 AUTH HEADERS
    const token = localStorage.getItem("authToken");
    const userType = localStorage.getItem("userType");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["x-user-type"] = userType;
    }

    // 🔥 GLOBAL LOADER (skip if explicitly disabled)
    if (!config.headers["x-no-loader"]) {
      loaderRef.start();
    }

    return config;
  },
  (error) => {
    loaderRef.stop();
    return Promise.reject(error);
  }
);

// 🔹 RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => {
    loaderRef.stop();
    return response;
  },
  (error) => {
    loaderRef.stop();

    // 🔐 Optional: auto logout on 401
    if (error.response?.status === 401) {
      console.warn("Unauthorized - token may be expired");
      // optional:
      // localStorage.clear();
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;