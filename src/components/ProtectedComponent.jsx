// components/ProtectedRoute.js
import React from "react";
import useAuthGuard from "./hooks/useAuthGuard";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuthGuard();

    if (loading) return <p>Loading...</p>;

    return children;
};

export default ProtectedRoute;
