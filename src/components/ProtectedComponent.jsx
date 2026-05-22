import useAuthGuard from "./hooks/useAuthGuard";
import "./ProtectedComponent.css";

const getCompleteProfilePath = () => {
  const accountType = localStorage.getItem("accountType");
  const storedUserType = localStorage.getItem("userType");
  const profileRole = localStorage.getItem("profileRole");
  const shopId = localStorage.getItem("shopId");

  if (accountType === "SHOP" || storedUserType === "BusinessOwner") {
    return shopId ? `/app/complete-shop-profile?id=${shopId}` : "/app/complete-shop-profile";
  }

  if (profileRole === "Employer" || storedUserType === "Employer") {
    return "/app/complete-profile-employer";
  }

  return "/app/create-labourer-profile";
};

const ProtectedRoute = ({ children, userType, allowIncompleteProfile = false }) => {
  const { user, loading, authorized } = useAuthGuard(userType);

  if (loading) return <p>Loading...</p>;

  if (!authorized) return <p>Unauthorized: Access denied.</p>;

  const profileIncomplete = localStorage.getItem("profileIncomplete") === "true";
  if (userType === "user" && profileIncomplete && !allowIncompleteProfile) {
    return (
      <div className="ProtectedRoute-incompleteProfile">
        <div className="ProtectedRoute-incompleteProfileBox">
          <p>Your profile is incomplete complete it first</p>
          <button type="button" onClick={() => window.location.assign(getCompleteProfilePath())}>
            Complete Profile
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
