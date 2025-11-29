const AdminProtectedRoute = ({ children }) => {
  const userType = localStorage.getItem("userType");
  const token = localStorage.getItem("authToken");

  if (!token || userType !== "admin") {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;