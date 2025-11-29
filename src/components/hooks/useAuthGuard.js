// hooks/useAuthGuard.js
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../axiosConfig";

const useAuthGuard = (userType) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userTypeStored = localStorage.getItem("userType") || userType;
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axiosInstance.post(
          "/api/users/protected",
          { userType: userTypeStored },
          { withCredentials: true }
        );

        const success = !!res.data?.success;
        const userFromResponse = res.data?.user || null;
        const backendUserType =
          userFromResponse?.userType ||
          res.data?.userType ||
          res.data?.role ||
          res.data?.accountType ||
          null;

        if(userFromResponse){
          localStorage.setItem("userId", userFromResponse.userId);
          localStorage.setItem("userType", userFromResponse.userType);
        }else{
          console.log("e");
          console.log(userFromResponse);
        }
        console.log("useAuthGuard response user:", userFromResponse);
        console.log("backendUserType:", backendUserType, "expected:", userType);

        // If API failed outright → redirect
        if (!success) {
          redirectToLogin(userType, navigate, location);
          return;
        }

        // ------- NORMAL APP USER GUARD -------
        if (userType === "user") {
          // For now: if backend says success and we got a user object, allow.
          if (userFromResponse) {
            setUser(userFromResponse);
            setAuthorized(true);
          } else {
            redirectToLogin("user", navigate, location);
          }
          return;
        }

        // ------- ADMIN GUARD -------
        if (userType === "admin") {
          if (
            typeof backendUserType === "string" &&
            backendUserType.toLowerCase() === "admin"
          ) {
            setUser(userFromResponse);
            setAuthorized(true);
          } else {
            redirectToLogin("admin", navigate, location);
          }
          return;
        }

        // ------- EMPLOYEE GUARD -------
        if (userType === "Employee" || userType === "employee") {
          if (
            typeof backendUserType === "string" &&
            backendUserType.toLowerCase() === "employee"
          ) {
            setUser(userFromResponse);
            setAuthorized(true);
          } else {
            redirectToLogin("Employee", navigate, location);
          }
          return;
        }

        // Fallback
        redirectToLogin(userType, navigate, location);
      } catch (err) {
        console.error("Auth verification failed:", err);
        redirectToLogin(userType, navigate, location);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [navigate, userType, location]);

  return { user, loading, authorized };
};

function redirectToLogin(userType, navigate, location) {
  const currentPath = location.pathname;

  if (userType === "admin") {
    if (currentPath !== "/admin-login") {
      navigate("/admin-login", { replace: true });
    }
    return;
  }

  if (userType === "Employee" || userType === "employee") {
    if (currentPath !== "/employee-login") {
      navigate("/employee-login", { replace: true });
    }
    return;
  }

  if (currentPath !== "/login") {
    navigate("/login", { replace: true });
  }
}

export default useAuthGuard;
