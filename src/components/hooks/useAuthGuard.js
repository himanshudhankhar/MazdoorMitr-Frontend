// hooks/useAuthGuard.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";

const useAuthGuard = (userType) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axiosInstance.post(
          "/api/users/protected",
          { userType },
          { withCredentials: true }
        );

        const userFromResponse = res.data?.user;
        console.log("user form "+ res.data);
        if (res.data.success && userFromResponse?.userType === userType) {
          setUser(userFromResponse);
          setAuthorized(true);
        } else {
          // Navigate to respective login based on userType
          if (userType === "admin") {
            navigate("/admin-login");
          }
          else if (userType == "Employee") {
            navigate("/employee-login");
          }
          else {
            navigate("/login");
          }
        }
      } catch (err) {
        console.error("Auth verification failed:", err);
        if (userType === "admin") {
          navigate("/admin-login");
        } else {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [navigate, userType]);

  return { user, loading, authorized };
};

export default useAuthGuard;
