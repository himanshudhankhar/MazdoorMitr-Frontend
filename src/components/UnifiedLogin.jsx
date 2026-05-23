import React, { useMemo, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, Phone, ShieldCheck, Store, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import "./UnifiedLogin.css";

const ACCOUNT_OPTIONS = [
  {
    id: "Labourer",
    accountType: "USER",
    label: "Worker",
    description: "Find work, receive calls, and keep your profile visible.",
    icon: UserRound,
  },
  {
    id: "Employer",
    accountType: "USER",
    label: "Employer",
    description: "Hire workers, post requirements, and manage contacts.",
    icon: BriefcaseBusiness,
  },
  {
    id: "BusinessOwner",
    accountType: "SHOP",
    label: "Shop",
    description: "Create or manage your shop listing and business profile.",
    icon: Store,
  },
];

const normalizePhone = (value) => String(value || "").replace(/\D/g, "").slice(-10);
const normalizeOtp = (value) => String(value || "").replace(/\D/g, "").slice(0, 6);

function getAccountOption(roleId) {
  return ACCOUNT_OPTIONS.find((option) => option.id === roleId) || ACCOUNT_OPTIONS[0];
}

function resolveRedirect(data, option) {
  if (data?.redirectUrl) return data.redirectUrl;

  if (option.accountType === "SHOP") {
    return data?.shop?.profileIncomplete ? "/app/complete-shop-profile" : "/app/shop-dashboard";
  }

  if (data?.user?.profileIncomplete) {
    return data.user.role === "Labourer"
      ? "/app/create-labourer-profile"
      : "/app/complete-profile-employer";
  }

  return "/app/home";
}

function saveSession(data, option) {
  const token = data?.token || data?.authToken || "";
  const user = data?.user || {};
  const shop = data?.shop || {};

  if (token) localStorage.setItem("authToken", token);
  localStorage.setItem("accountType", data?.accountType || option.accountType);
  localStorage.setItem("phone", user.phone || shop.phone || "");

  if (option.accountType === "SHOP") {
    localStorage.setItem("shopId", shop.id || "");
    localStorage.setItem("userType", "BusinessOwner");
    localStorage.setItem("profileRole", "BusinessOwner");
    localStorage.setItem("profileIncomplete", String(shop.profileIncomplete === true));
    localStorage.removeItem("userId");
    return;
  }

  localStorage.setItem("userId", user.id || "");
  localStorage.setItem("userType", user.role || option.id);
  localStorage.setItem("profileRole", user.role || user.userType || option.id);
  localStorage.setItem("profileIncomplete", String(user.profileIncomplete === true));
  localStorage.removeItem("shopId");
}

const UnifiedLogin = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("Labourer");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const selectedOption = useMemo(() => getAccountOption(selectedRole), [selectedRole]);

  const showMessage = (text, type = "") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setOtp("");
    setOtpSent(false);
    showMessage("");
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();
    const normalized = normalizePhone(phone);

    if (normalized.length !== 10) {
      showMessage("Enter a valid 10 digit mobile number.", "error");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post(
        "/api/users/auth/request-otp",
        { phone: normalized },
        { headers: { "x-no-loader": "true" }, withCredentials: true }
      );
      setPhone(normalized);
      setOtpSent(true);
      showMessage(`OTP sent to +91 ${normalized}.`, "success");
    } catch (error) {
      showMessage(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Could not send OTP. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    const normalized = normalizePhone(phone);
    const selectedOtp = normalizeOtp(otp);

    if (normalized.length !== 10) {
      showMessage("Enter a valid 10 digit mobile number.", "error");
      return;
    }

    if (selectedOtp.length < 4) {
      showMessage("Enter the OTP sent to your phone.", "error");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        "/api/users/auth/verify-otp",
        {
          phone: normalized,
          otp: selectedOtp,
          accountType: selectedOption.accountType,
          role: selectedOption.accountType === "USER" ? selectedOption.id : "BusinessOwner",
        },
        { headers: { "x-no-loader": "true" }, withCredentials: true }
      );

      saveSession(data, selectedOption);
      showMessage("Login successful. Redirecting...", "success");
      navigate(resolveRedirect(data, selectedOption), { replace: true });
    } catch (error) {
      showMessage(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Could not verify OTP. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="unified-login-page">
      <section className="unified-login-shell" aria-label="MazdoorMitr mobile OTP login">
        <aside className="unified-login-story">
          <div>
            <div className="unified-login-brand">
              <span>MazdoorMitr</span>
            </div>
            <h1>One mobile number. Every work account.</h1>
            <p>
              Sign in or create your account with OTP. Choose Worker, Employer, or Shop and
              MazdoorMitr will take you to the right next step.
            </p>
          </div>

          <div className="unified-login-proof">
            <div>
              <strong>OTP</strong>
              <span>No password needed</span>
            </div>
            <div>
              <strong>3 roles</strong>
              <span>Worker, employer, shop</span>
            </div>
            <div>
              <strong>Fast</strong>
              <span>New users continue to profile</span>
            </div>
          </div>
        </aside>

        <section className="unified-login-panel">
          <p className="unified-login-step">{otpSent ? "Step 2 of 2" : "Step 1 of 2"}</p>
          <h2>{otpSent ? "Enter your OTP" : "Continue with mobile OTP"}</h2>
          <p className="unified-login-subtitle">
            {otpSent
              ? "We use the same OTP for login and signup, so there is no separate account creation form."
              : "Select how you want to use MazdoorMitr, then enter your mobile number."}
          </p>

          <form className="unified-login-form" onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
            <div className="unified-login-roleGrid" role="tablist" aria-label="Account type">
              {ACCOUNT_OPTIONS.map((option) => {
                const Icon = option.icon;
                const active = selectedRole === option.id;
                return (
                  <button
                    className={`unified-login-roleCard${active ? " active" : ""}`}
                    type="button"
                    key={option.id}
                    onClick={() => handleRoleSelect(option.id)}
                    aria-pressed={active}
                  >
                    <Icon size={20} aria-hidden="true" />
                    <strong>{option.label}</strong>
                    <span>{option.description}</span>
                  </button>
                );
              })}
            </div>

            <label className="unified-login-field" htmlFor="login-phone">
              <span>Mobile number</span>
              <div className="unified-login-phoneInput">
                <Phone size={18} aria-hidden="true" />
                <input
                  id="login-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="10 digit mobile number"
                  maxLength={10}
                  value={phone}
                  onChange={(event) => setPhone(normalizePhone(event.target.value))}
                />
              </div>
            </label>

            {otpSent && (
              <label className="unified-login-field" htmlFor="login-otp">
                <span>OTP</span>
                <div className="unified-login-otpRow">
                  <div className="unified-login-phoneInput">
                    <ShieldCheck size={18} aria-hidden="true" />
                    <input
                      id="login-otp"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="Enter OTP"
                      maxLength={6}
                      value={otp}
                      onChange={(event) => setOtp(normalizeOtp(event.target.value))}
                    />
                  </div>
                  <button
                    className="unified-login-secondary"
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                  >
                    Resend
                  </button>
                </div>
              </label>
            )}

            <button className="unified-login-primary" type="submit" disabled={loading}>
              {loading ? (otpSent ? "Verifying..." : "Sending...") : otpSent ? "Verify and continue" : "Send OTP"}
            </button>

            {otpSent && (
              <button
                className="unified-login-back"
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  showMessage("");
                }}
                disabled={loading}
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Change mobile or role
              </button>
            )}
          </form>

          <div className={`unified-login-message ${messageType}`} role="status">
            {message}
          </div>
          <p className="unified-login-note">
            Worker and employer accounts continue to profile completion when required. Shop
            accounts continue to shop profile setup.
          </p>
        </section>
      </section>
    </main>
  );
};

export default UnifiedLogin;
