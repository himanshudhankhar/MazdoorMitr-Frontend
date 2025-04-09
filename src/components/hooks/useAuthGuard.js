// hooks/useAuthGuard.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../axiosConfig";
const useAuthGuard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const res = await axiosInstance.get("/api/users/protected", {   
                    withCredentials: true, // ✅ THIS sends cookies like authToken
                  });
                  console.log('res.data',res.data.success);
                if (res.data.success) {
                    const data = res.data;
                    console.log('data', data);
                    setUser(data.user);
                    
                } else {
                    console.log('res', res);
                    navigate("/login");
                }
            } catch (err) {
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [navigate]);

    return { user, loading };
};

export default useAuthGuard;
