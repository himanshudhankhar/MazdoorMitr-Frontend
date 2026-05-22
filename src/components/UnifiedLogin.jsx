// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../axiosConfig";
// import "./UnifiedLogin.css";

// const UnifiedLogin = () => {
//     const navigate = useNavigate();

//     const [step, setStep] = useState("ACCOUNT_TYPE");
//     const [accountType, setAccountType] = useState(null);
//     const [phone, setPhone] = useState("");
//     const [otp, setOtp] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     const normalizePhone = (value) => value.replace(/\D/g, "").slice(-10);
//     const validatePhone = (value) => value && value.length === 10;
//     const validateOtp = (value) => value && value.length >= 4;

//     const redirectAfterUserLogin = () => {
//         navigate("/app/home");
//     };

//     const redirectAfterShopLogin = (shop) => {
//         if (!shop) return navigate("/app/home");

//         const { id, status, profileIncomplete } = shop;

//         if (profileIncomplete) return navigate(`/app/complete-shop-profile?id=${id}`);
//         // if (status === "PENDING_REVIEW") return navigate("/shops/review-status");
//         // if (status === "REJECTED") return navigate("/shops/review-status?state=rejected");
//         return navigate("/app/shop-dashboard");
//     };

//     const handleSelectAccountType = (type) => {
//         setAccountType(type);
//         setError("");
//         setPhone("");
//         setOtp("");
//         setStep("PHONE");
//     };

//     const handleSendOtp = async (e) => {
//         e.preventDefault();
//         setError("");

//         if (!accountType) {
//             setError("कृपया पहले User या Shop चुनें।");
//             return;
//         }

//         const normalized = normalizePhone(phone);
//         if (!validatePhone(normalized)) {
//             setError("कृपया 10 अंकों का सही मोबाइल नंबर डालें।");
//             return;
//         }

//         try {
//             setLoading(true);
//             await axiosInstance.post(
//                 "/api/users/auth/request-otp",
//                 { phone: normalized },
//                 { withCredentials: true }
//             );
//             setPhone(normalized);
//             setStep("OTP");
//         } catch (err) {
//             setError(
//                 err?.response?.data?.message ||
//                 err?.response?.data?.error ||
//                 "OTP भेजने में समस्या आ रही है।"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleVerifyOtp = async (e) => {
//         e.preventDefault();
//         setError("");

//         if (!accountType) {
//             setError("कृपया User या Shop अकाउंट चुनें।");
//             return;
//         }

//         if (!validateOtp(otp)) {
//             setError("कृपया सही OTP डालें।");
//             return;
//         }

//         try {
//             setLoading(true);

//             const res = await axiosInstance.post(
//                 "/api/users/auth/verify-otp",
//                 { phone, otp, accountType },
//                 { withCredentials: true }
//             );

//             const data = res.data || {};
//             const token = data.token || data.authToken;
//             if (token) localStorage.setItem("authToken", token);
//             if (data.accountType === "SHOP") {
//                 localStorage.setItem("shopId", data.shop.id);
//                 localStorage.setItem("accountType", "SHOP");
//                 localStorage.setItem("userType", "BusinessOwner"); // for old APIs expecting userType
//                 redirectAfterShopLogin(data.shop);
//                 return;
//             }
//             if (data.accountType === "USER" && data.user) {
//                 localStorage.setItem("userId", data.user.id);
//                 localStorage.setItem("accountType", "USER");
//                 localStorage.setItem("userType", "user"); // for old APIs expecting userType
//                 redirectAfterUserLogin();
//                 return;
//             }

//         } catch (err) {
//             setError(
//                 err?.response?.data?.message ||
//                 err?.response?.data?.error ||
//                 "OTP वेरिफाई करने में समस्या आ रही है।"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="unified_login_page">
//             <div className="unified_login_card">
//                 <div className="unified_login_header">
//                     <h1 className="unified_login_title">Mazdoormitr</h1>
//                     <p className="unified_login_subtitle">एक ही मोबाइल नंबर से Login / Signup</p>
//                 </div>

//                 {error && <div className="unified_login_error">{error}</div>}

//                 {step === "ACCOUNT_TYPE" && (
//                     <div className="unified_login_form">
//                         <p className="unified_login_info">
//                             चुनें कि आप <strong>User</strong> login कर रहे हैं या <strong>Shop</strong>.
//                         </p>

//                         <div className="unified_login_roles">
//                             <button
//                                 type="button"
//                                 className="unified_login_role_btn"
//                                 onClick={() => handleSelectAccountType("USER")}
//                                 disabled={loading}
//                             >
//                                 👤 User (मजदूर / नियोक्ता)
//                             </button>

//                             <button
//                                 type="button"
//                                 className="unified_login_role_btn"
//                                 onClick={() => handleSelectAccountType("SHOP")}
//                                 disabled={loading}
//                             >
//                                 🏪 Shop (दुकान / व्यापार)
//                             </button>
//                         </div>

//                         <p className="unified_login_hint">User और Shop अकाउंट अलग-अलग होते हैं।</p>
//                     </div>
//                 )}

//                 {step === "PHONE" && (
//                     <form className="unified_login_form" onSubmit={handleSendOtp}>
//                         <div className="unified_login_info">
//                             <p>
//                                 Login as:{" "}
//                                 <strong>{accountType === "SHOP" ? "Shop Account" : "User Account"}</strong>
//                             </p>
//                             <button
//                                 type="button"
//                                 className="unified_login_btn unified_login_btn_link"
//                                 onClick={() => setStep("ACCOUNT_TYPE")}
//                                 disabled={loading}
//                             >
//                                 बदलें User/Shop
//                             </button>
//                         </div>

//                         <label className="unified_login_label">
//                             मोबाइल नंबर
//                             <div className="unified_login_phone_row">
//                                 <span className="unified_login_phone_prefix">+91</span>
//                                 <input
//                                     type="tel"
//                                     inputMode="numeric"
//                                     maxLength={10}
//                                     className="unified_login_input"
//                                     placeholder="10 अंकों का नंबर"
//                                     value={phone}
//                                     onChange={(e) => setPhone(normalizePhone(e.target.value))}
//                                 />
//                             </div>
//                         </label>

//                         <button
//                             type="submit"
//                             className="unified_login_btn unified_login_btn_primary"
//                             disabled={loading}
//                         >
//                             {loading ? "OTP भेजा जा रहा है..." : "OTP भेजें"}
//                         </button>
//                     </form>
//                 )}

//                 {step === "OTP" && (
//                     <form className="unified_login_form" onSubmit={handleVerifyOtp}>
//                         <div className="unified_login_info">
//                             <p>
//                                 Login as <strong>{accountType === "SHOP" ? "Shop" : "User"}</strong> :{" "}
//                                 <strong>+91-{phone}</strong>
//                             </p>
//                             <button
//                                 type="button"
//                                 className="unified_login_btn unified_login_btn_link"
//                                 onClick={() => setStep("PHONE")}
//                                 disabled={loading}
//                             >
//                                 बदलें
//                             </button>
//                         </div>

//                         <label className="unified_login_label">
//                             OTP
//                             <input
//                                 type="tel"
//                                 inputMode="numeric"
//                                 className="unified_login_input"
//                                 placeholder="प्राप्त OTP डालें"
//                                 value={otp}
//                                 onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//                             />
//                         </label>

//                         <button
//                             type="submit"
//                             className="unified_login_btn unified_login_btn_primary"
//                             disabled={loading}
//                         >
//                             {loading ? "जाँच हो रही है..." : "OTP Verify करें"}
//                         </button>
//                     </form>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default UnifiedLogin;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import "./UnifiedLogin.css";

const UnifiedLogin = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState("ACCOUNT_TYPE"); // ACCOUNT_TYPE | PHONE | OTP | USER_ROLE
    const [accountType, setAccountType] = useState(null);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentUser, setCurrentUser] = useState(null); // for USER flow

    const normalizePhone = (value) => value.replace(/\D/g, "").slice(-10);
    const validatePhone = (value) => value && value.length === 10;
    const validateOtp = (value) => value && value.length >= 4;

    const redirectAfterUserLogin = (user) => {
        if (!user) {
            navigate("/app/home");
            return;
        }

        const role = user.role || user.userType || null;
        const profileIncomplete =
            typeof user.profileIncomplete === "boolean"
                ? user.profileIncomplete
                : false;

        if (profileIncomplete) {
            if (role === "Employer") {
                navigate("/app/complete-profile-employer");
                return;
            }
            if (role === "Labourer") {
                navigate("/app/create-labourer-profile");
                return;
            }
            navigate("/app/complete-profile");
            return;
        }

        navigate("/app/home");
    };

    const redirectAfterShopLogin = (shop) => {
        if (!shop) return navigate("/app/home");

        const { id, status, profileIncomplete } = shop;

        if (profileIncomplete) return navigate(`/app/complete-shop-profile?id=${id}`);
        // if (status === "PENDING_REVIEW") return navigate("/shops/review-status");
        // if (status === "REJECTED") return navigate("/shops/review-status?state=rejected");
        return navigate("/app/shop-dashboard");
    };

    const handleSelectAccountType = (type) => {
        setAccountType(type);
        setError("");
        setPhone("");
        setOtp("");
        setCurrentUser(null);
        setStep("PHONE");
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError("");

        if (!accountType) {
            setError("कृपया पहले User या Shop चुनें।");
            return;
        }

        const normalized = normalizePhone(phone);
        if (!validatePhone(normalized)) {
            setError("कृपया 10 अंकों का सही मोबाइल नंबर डालें।");
            return;
        }

        try {
            setLoading(true);
            await axiosInstance.post(
                "/api/users/auth/request-otp",
                { phone: normalized },
                { withCredentials: true }
            );
            setPhone(normalized);
            setStep("OTP");
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "OTP भेजने में समस्या आ रही है।"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");

        if (!accountType) {
            setError("कृपया User या Shop अकाउंट चुनें।");
            return;
        }

        if (!validateOtp(otp)) {
            setError("कृपया सही OTP डालें।");
            return;
        }

        try {
            setLoading(true);

            const res = await axiosInstance.post(
                "/api/users/auth/verify-otp",
                { phone, otp, accountType },
                { withCredentials: true }
            );

            const data = res.data || {};
            const token = data.token || data.authToken;
            if (token) localStorage.setItem("authToken", token);

            if (data.accountType === "SHOP") {
                localStorage.setItem("shopId", data.shop.id);
                localStorage.setItem("accountType", "SHOP");
                localStorage.setItem("userType", "BusinessOwner"); // for old APIs expecting userType
                localStorage.setItem("profileRole", "BusinessOwner");
                localStorage.setItem("profileIncomplete", String(data.shop.profileIncomplete === true));
                redirectAfterShopLogin(data.shop);
                return;
            }

            if (data.accountType === "USER" && data.user) {
                const user = data.user;
                localStorage.setItem("userId", user.id);
                localStorage.setItem("accountType", "USER");
                localStorage.setItem("userType", user.role || "user");
                localStorage.setItem("profileRole", user.role || user.userType || "user");
                localStorage.setItem("profileIncomplete", String(user.profileIncomplete === true));

                setCurrentUser(user);

                if (user.role) {
                    redirectAfterUserLogin(user);
                    return;
                }

                setStep("USER_ROLE");
                return;
            }

        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "OTP वेरिफाई करने में समस्या आ रही है।"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSelectUserRole = async (role) => {
        if (!role) return;
        setError("");

        try {
            setLoading(true);

            const res = await axiosInstance.post(
                "/api/users/protected/set-role",
                { role }, // "Labourer" | "Employer"
                { withCredentials: true }
            );

            const updatedUser = res.data?.user || res.data || currentUser || null;
            setCurrentUser(updatedUser);

            if (updatedUser?.id) {
                localStorage.setItem("userId", updatedUser.id);
                localStorage.setItem("accountType", "USER");
                localStorage.setItem("userType", updatedUser.role || "user");
                localStorage.setItem("profileRole", updatedUser.role || updatedUser.userType || "user");
                localStorage.setItem("profileIncomplete", String(updatedUser.profileIncomplete === true));
            }

            redirectAfterUserLogin(updatedUser);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "रोल सेट करने में समस्या आ रही है।"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="unified_login_page">
            <div className="unified_login_card">
                <div className="unified_login_header">
                    <h1 className="unified_login_title">Mazdoormitr</h1>
                    <p className="unified_login_subtitle">एक ही मोबाइल नंबर से Login / Signup</p>
                </div>

                {error && <div className="unified_login_error">{error}</div>}

                {step === "ACCOUNT_TYPE" && (
                    <div className="unified_login_form">
                        <p className="unified_login_info">
                            चुनें कि आप <strong>User</strong> login कर रहे हैं या <strong>Shop</strong>.
                        </p>

                        <div className="unified_login_roles">
                            <button
                                type="button"
                                className="unified_login_role_btn"
                                onClick={() => handleSelectAccountType("USER")}
                                disabled={loading}
                            >
                                👤 User (मजदूर / नियोक्ता)
                            </button>

                            <button
                                type="button"
                                className="unified_login_role_btn"
                                onClick={() => handleSelectAccountType("SHOP")}
                                disabled={loading}
                            >
                                🏪 Shop (दुकान / व्यापार)
                            </button>
                        </div>

                        <p className="unified_login_hint">User और Shop अकाउंट अलग-अलग होते हैं।</p>
                    </div>
                )}

                {step === "PHONE" && (
                    <form className="unified_login_form" onSubmit={handleSendOtp}>
                        <div className="unified_login_info">
                            <p>
                                Login as:{" "}
                                <strong>{accountType === "SHOP" ? "Shop Account" : "User Account"}</strong>
                            </p>
                            <button
                                type="button"
                                className="unified_login_btn unified_login_btn_link"
                                onClick={() => setStep("ACCOUNT_TYPE")}
                                disabled={loading}
                            >
                                बदलें User/Shop
                            </button>
                        </div>

                        <label className="unified_login_label">
                            मोबाइल नंबर
                            <div className="unified_login_phone_row">
                                <span className="unified_login_phone_prefix">+91</span>
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={10}
                                    className="unified_login_input"
                                    placeholder="10 अंकों का नंबर"
                                    value={phone}
                                    onChange={(e) => setPhone(normalizePhone(e.target.value))}
                                />
                            </div>
                        </label>

                        <button
                            type="submit"
                            className="unified_login_btn unified_login_btn_primary"
                            disabled={loading}
                        >
                            {loading ? "OTP भेजा जा रहा है..." : "OTP भेजें"}
                        </button>
                    </form>
                )}

                {step === "OTP" && (
                    <form className="unified_login_form" onSubmit={handleVerifyOtp}>
                        <div className="unified_login_info">
                            <p>
                                Login as <strong>{accountType === "SHOP" ? "Shop" : "User"}</strong> :{" "}
                                <strong>+91-{phone}</strong>
                            </p>
                            <button
                                type="button"
                                className="unified_login_btn unified_login_btn_link"
                                onClick={() => setStep("PHONE")}
                                disabled={loading}
                            >
                                बदलें
                            </button>
                        </div>

                        <label className="unified_login_label">
                            OTP
                            <input
                                type="tel"
                                inputMode="numeric"
                                className="unified_login_input"
                                placeholder="प्राप्त OTP डालें"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            />
                        </label>

                        <button
                            type="submit"
                            className="unified_login_btn unified_login_btn_primary"
                            disabled={loading}
                        >
                            {loading ? "जाँच हो रही है..." : "OTP Verify करें"}
                        </button>
                    </form>
                )}

                {step === "USER_ROLE" && (
                    <div className="unified_login_form">
                        <p className="unified_login_info">
                            स्वागत है {currentUser?.phone ? `(+91-${currentUser.phone})` : ""}!{" "}
                            आप Mazdoormitr पर किस रूप में हैं?
                        </p>

                        <div className="unified_login_roles">
                            <button
                                type="button"
                                className="unified_login_role_btn"
                                onClick={() => handleSelectUserRole("Labourer")}
                                disabled={loading}
                            >
                                👷 मैं Labourer / Worker हूँ
                            </button>

                            <button
                                type="button"
                                className="unified_login_role_btn"
                                onClick={() => handleSelectUserRole("Employer")}
                                disabled={loading}
                            >
                                🧑‍💼 मैं Employer / Contractor हूँ
                            </button>
                        </div>

                        <p className="unified_login_hint">
                            चुने हुए रोल के हिसाब से अगला पेज आपका प्रोफाइल पूरा करने के लिए खुलेगा।
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnifiedLogin;
