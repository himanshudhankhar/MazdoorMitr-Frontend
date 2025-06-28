import useAuthGuard from "./hooks/useAuthGuard";

const ProtectedRoute = ({ children, userType }) => {
  const { user, loading, authorized } = useAuthGuard(userType);

  if (loading) return <p>Loading...</p>;

  if (!authorized) return <p>Unauthorized: Access denied.</p>;

  return children;
};

export default ProtectedRoute;

