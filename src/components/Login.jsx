import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import api from "../axiosConfig";
import validator from "validator";

/**
 * LoginPage.jsx — with Auto-Open Policies Modal (1s after switching to Sign Up)
 * ----------------------------------------------------------------------------
 * - Consent checkbox shown only on Sign Up
 * - Policies modal opens automatically 1 second after toggling to Sign Up
 * - Policies are displayed inline (scrollable), not as external links
 * - Fully controlled inputs (no document.getElementById)
 */

// 🔧 Replace these with your real HTML content (paste from your policy pages)
const TERMS_HTML = `
 <h1>Terms and Conditions</h1>
            <p><strong>Effective Date:</strong> August 23, 2025</p>
            <p><strong>Platform Owner:</strong> Quickclap Solutions Pvt. Ltd. ("we", "our", "us")</p>

            <p>Welcome to <strong>MazdoorMitr</strong> – a platform built to connect employers with blue-collar workers across India. By accessing or using our website, mobile application, or services (collectively "Platform"), you agree to abide by these Terms and Conditions.</p>

            <h2>1. Definitions</h2>
            <ul>
                <li><strong>User:</strong> Any person (including employers or workers) who accesses or registers on the platform.</li>
                <li><strong>Worker:</strong> A blue-collar worker or labourer registered on the platform.</li>
                <li><strong>Employer:</strong> A person or business entity seeking to hire labourers through MazdoorMitr.</li>
                <li><strong>Wallet:</strong> The in-platform credit account used for service transactions.</li>
            </ul>

            <h2>2. Account Registration and KYC</h2>
            <ul>
                <li>All users must register and provide accurate information.</li>
                <li>Certain features may require Aadhaar or biometric verification.</li>
                <li>We reserve the right to suspend accounts with inconsistent or fraudulent information.</li>
            </ul>

            <h2>3. Services</h2>
            <ul>
                <li>Employers can view contact details of registered workers.</li>
                <li>Some amount is charged from the employer's wallet when a worker's phone number is viewed.</li>
                <li>This amount is credited to the worker's wallet to compensate for their time. And a small cut for platform fee to keep the platform running.</li>
                <li>We do <strong>not</strong> guarantee hiring or any employment outcome.</li>
            </ul>

            <h2>4. Wallet and Credit Policy</h2>
            <ul>
                <li>Each user has a wallet on the MazdoorMitr platform for credit-based transactions.</li>
                <li>Credits can be earned when an employer views a worker’s contact details or through other eligible activities.</li>
                <li>Wallet balances can be used only for services within MazdoorMitr unless stated otherwise.</li>
                <li>Users can <strong>withdraw funds to their registered bank account</strong> if their wallet balance exceeds ₹50.</li>
                <li>Withdrawal requests are subject to verification, processing times, and may take 3–5 business days to reflect in the bank account.</li>
                <li>MazdoorMitr reserves the right to reject withdrawal requests if fraud, impersonation, or misuse is detected.</li>
                <li>You can withdraw money from your wallet if the balance is more than ₹50. Otherwise, the money in your wallet cannot be refunded or transferred to other platforms.</li>
            </ul>


            <h2>5. Refund and Cancellation Policy</h2>
            <ul>
                <li>No refunds are provided once contact information is shared.</li>
                <li>Technical errors must be reported within 48 hours.</li>
                <li>Refund requests will be evaluated on a case-by-case basis and are not guaranteed.</li>
            </ul>

            <h2>6. User Conduct</h2>
            <ul>
                <li>Do not post false, misleading, or fraudulent information.</li>
                <li>Do not use the platform for spam, harassment, or illegal activity.</li>
                <li>Respect fellow users and communicate ethically.</li>
                <li>Do not impersonate others or misuse worker data.</li>
            </ul>
            <p>Violation of these guidelines may result in suspension or permanent banning.</p>

            <h2>7. Content and Intellectual Property</h2>
            <ul>
                <li>Users grant MazdoorMitr a non-exclusive license to use submitted data for verification and legal compliance.</li>
                <li>All platform content, including branding and service models, is the intellectual property of Quickclap Solutions Pvt. Ltd.</li>
            </ul>

            <h2>8. Privacy and Data Usage</h2>
            <p>We collect only essential data and handle it securely as per our <a href="/privacy-policy">Privacy Policy</a>. No personal data is shared with third parties without consent.</p>

            <h2>9. Third-Party Services</h2>
            <ul>
                <li>MazdoorMitr integrates third-party APIs (SMS, payments, cloud storage).</li>
                <li>We are not liable for service interruptions caused by these external providers.</li>
            </ul>

            <h2>10. Termination</h2>
            <ul>
                <li>We may suspend or terminate your access if you breach any of our terms or policies.</li>
                <li>Fraudulent or harmful activity is detected.</li>
                <li>You are inactive for more than 6 months (with prior notice).</li>
            </ul>

            <h2>11. Disclaimers and Limitations</h2>
            <ul>
                <li>We are not responsible for any direct or indirect loss due to job connections.</li>
                <li>MazdoorMitr is a technology platform, <strong>not</strong> an employer or contractor.</li>
                <li>Users must perform their own due diligence before engaging with others.</li>
            </ul>

            <h2>12. Governing Law</h2>
            <p>These Terms are governed by the laws of India. Any dispute shall be subject to the jurisdiction of Delhi courts.</p>

            <h2>13. Changes to Terms</h2>
            <p>MazdoorMitr may update these Terms. Continued use of the platform implies acceptance of updated terms.</p>

            <h2>14. Contact Us</h2>
            <p>
                For questions or concerns, contact us at:<br />
                <strong>Email:</strong> quickclap7@gmail.com<br />
                <strong>Phone:</strong> +91-8368084123
            </p>

            <p><strong>MazdoorMitr – Empowering India’s Workforce.</strong></p>
`;

const PRIVACY_HTML = `
<h1>Privacy Policy for MazdoorMitr</h1>
        <p><strong>Effective Date:</strong> August 24, 2025</p>

        <h2>1. Introduction</h2>
        <p>
            MazdoorMitr ("we", "our", "us"), operated by Quickclap Solutions Pvt. Ltd., is a platform
            designed to connect blue-collar workers (“labourers”) with employers. This Privacy Policy explains
            how we collect, use, share, retain, and protect your personal information in compliance with the
            Information Technology Act, 2000 and applicable data protection rules in India.
        </p>

        <h2>2. Information We Collect</h2>
        <ul>
            <li><strong>Personal Information:</strong> Name, phone number, location, skills, and profile details.</li>
            <li><strong>Transactional Information:</strong> Wallet credits, withdrawals, and history of number views.</li>
            <li><strong>Authentication Data:</strong> OTP-verification logs, device/IP metadata.</li>
        </ul>

        <h2>3. Purpose of Processing</h2>
        <p>We process your data for the following purposes:</p>
        <ul>
            <li>To provide MazdoorMitr services, including contact-number sharing with employer consent and ₹10 wallet credit per view.</li>
            <li>To process wallet deductions, credits, and withdrawals (only for balances above ₹50).</li>
            <li>To verify identity through OTP and optional KYC, and to maintain platform security.</li>
            <li>To prevent fraud, resolve disputes, and provide customer support.</li>
            <li>To comply with applicable laws and legal obligations.</li>
        </ul>

        <h2>4. Contact Information Sharing Policy</h2>
        <p>
            By registering on MazdoorMitr, you provide explicit consent that your contact number may be shared
            with verified employers on our platform <strong>only for the purpose of job-related opportunities</strong>.
            Each time your number is viewed, ₹10 is deducted from the employer’s wallet and credited to your MazdoorMitr wallet.
        </p>
        <p>
            <strong>This does not constitute “selling data.”</strong> Your contact details are shared only with employers
            for job connection purposes and not with advertisers, marketers, or unrelated third parties.
        </p>
        <p>
            Employers are strictly prohibited from misusing this information (e.g., spam, harassment, non-job-related activities).
            Any violation can lead to suspension or termination of the employer’s account.
        </p>

        <h2>5. Consent, Review & Withdrawal</h2>
        <p>
            You may review and update your information through your profile settings. You may withdraw your consent
            at any time by deactivating your account, after which your data will be deleted within 72 hours, except where
            retention is legally required.
        </p>

        <h2>6. Sharing and Disclosure of Information</h2>
        <ul>
            <li>We do not sell your data to advertisers or unrelated parties.</li>
            <li>We may share information with service providers (e.g., SMS, payments) under strict confidentiality obligations.</li>
            <li>We may disclose data when required by law, legal process, or government authorities.</li>
        </ul>

        <h2>7. Data Retention</h2>
        <p>
            We retain data only as long as necessary to provide services, meet legal obligations, and resolve disputes.
            Wallet and transaction records may be kept for compliance purposes even after account deletion.
        </p>

        <h2>8. Security Practices</h2>
        <p>
            We implement reasonable security practices, including encryption, access controls, and monitoring systems,
            to protect your personal data. However, no system is entirely secure, and you share data at your own risk.
        </p>

        <h2>9. Notice & Takedown Policy</h2>
        <p>
            If you believe your contact information is being misused, or if unlawful content is posted on the platform,
            you may notify us. Upon verification, we will remove or restrict such content as per IT Act Section 79 obligations.
        </p>

        <h2>10. Data Breach Notification</h2>
        <p>
            In case of a data breach that could cause harm, we will notify affected users and relevant authorities as required by law.
        </p>

        <h2>11. Changes to This Policy</h2>
        <p>
            We may update this Privacy Policy from time to time. Users will be notified of major changes via app notifications or email.
            Continued use of the service after updates implies acceptance of the revised policy.
        </p>

        <h2>12. Grievance Officer</h2>
        <p>
            In compliance with the Information Technology Act, 2000 and rules thereunder, the name and contact details of the
            Grievance Officer are as follows:
        </p>
        <p>
            <strong>Grievance Officer:</strong> Satyawati<br/>
                <strong>Email:</strong> <a href="mailto:satyawati459@gmail.com">satyawati459@gmail.com</a><br/>
                    <strong>Response Time:</strong> Within 30 days of receiving a complaint.
                </p>
`;

const WALLET_HTML = `
  <h3>Wallet & Credits Policy</h3>
  <ul>
    <li>Employers load credits; viewing a phone number deducts ₹15 + GST and credits ₹10 to the labourer.</li>
    <li>Labourers can withdraw to bank if balance is <strong>above ₹50</strong> (T+1 to T+3 working days).</li>
    <li>Except valid withdrawals above ₹50, credits are non-refundable and not transferable outside the platform.</li>
  </ul>
`;

const REFUND_HTML = `
   <h1>Refund Policy for MazdoorMitr</h1>
        <p><strong>Effective Date:</strong> August 24, 2025</p>

        <h2>1. Overview</h2>
        <p>
            MazdoorMitr ("we", "our", "us") connects labourers with employers. Our platform provides
            paid contact views—employers pay ₹10 per view, which is credited to the labourer's wallet.
            This Refund Policy governs how refunds may be processed for wallet credits or employer
            charges.
        </p>

        <h2>2. For Labourers (Wallet Credits)</h2>
        <ul>
            <li>
                Accrued wallet credits are non-refundable and cannot be withdrawn until the balance exceeds ₹50.
            </li>
            <li>
                If your account is deactivated without withdrawal, your wallet credits will be forfeited.
            </li>
            <li>
                In case of any error (e.g., wrong employer charges or duplicate deductions),
                please email <a href="mailto:satyawati459@gmail.com">satyawati459@gmail.com</a>
                with details such as date, time, and transaction IDs. We'll investigate and, where
                justified, adjust your wallet balance within 5 working days.
            </li>
        </ul>

        <h2>3. For Employers (Contact-View Charges)</h2>
        <ul>
            <li>
                Once earned, credits cannot be reversed retrospectively unless there is a demonstrable
                error (e.g., fraudulent or technical error).
            </li>
            <li>
                To request a refund for any invalid or duplicate deductions, email
                <a href="mailto:satyawati459@gmail.com">satyawati459@gmail.com</a>
                with transaction details. If validated, a refund or reversal will be processed within
                5 working days and credited back to the original payment method or wallet.
            </li>
            <li>
                Refunds will not be provided for legitimate contact views or if the labourer has
                received the contact as intended.
            </li>
        </ul>

        <h2>4. Refund Request Procedures</h2>
        <p>
            Please include the following when submitting a refund request:
        </p>
        <ul>
            <li>Full name (as on account)</li>
            <li>User type (Labourer or Employer)</li>
            <li>Date and time of the transaction</li>
            <li>Transaction or View ID</li>
            <li>Reason for the refund request</li>
        </ul>
        <p>
            We will acknowledge your request within 2 working days and complete processing within 5 working days.
        </p>

        <h2>5. Disclaimers</h2>
        <ul>
            <li>
                MazdoorMitr reserves the right to deny refunds for misuse or violations of our platform
                policies (e.g., fraud, multiple account misuse).
            </li>
            <li>
                All refunds, if approved, will be processed using the same source as the original payment,
                unless otherwise agreed upon.
            </li>
        </ul>

        <h2>6. Grievance Redressal</h2>
        <p>
            If you're dissatisfied with the outcome of your refund request, you may escalate the matter
            to our Grievance Officer:
        </p>
        <p>
            <strong>Grievance Officer:</strong> Satyawati <br />
            <strong>Email:</strong> <a href="mailto:satyawati459@gmail.com">satyawati459@gmail.com</a><br />
            <strong>Expected Response Time:</strong> Within 30 days of receipt.
        </p>

        <h2>7. Changes to the Policy</h2>
        <p>
            We may update this Refund Policy periodically. We will notify users of substantial changes via
            email or in-app notification. Your continued use of the platform implies acceptance of the updated policy.
        </p>
`;

function PolicyModal({ open, onClose, sections }) {
    if (!open) return null;
    return (
        <div className="mmodal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="mmodal" onClick={(e) => e.stopPropagation()}>
                <div className="mmodal-header">
                    <h2>Policies & User Agreement</h2>
                    <button className="mmodal-close" aria-label="Close" onClick={onClose}>✕</button>
                </div>
                <div className="mmodal-scroll">
                    {sections.map((s, idx) => (
                        <section key={idx} className="mmodal-section">
                            <h2 className="mmodal-section-title">{s.title}</h2>
                            <div className="mmodal-section-body" dangerouslySetInnerHTML={{ __html: s.html }} />
                        </section>
                    ))}
                </div>
                <div className="mmodal-footer">
                    <button className="mmodal-btn" onClick={onClose}>Close</button>
                </div>
            </div>

            {/* Minimal CSS for modal (scoped classNames) */}
            <style>{`
        .mmodal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:16px;z-index:9999}
        .mmodal{background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.2);width:min(920px,100%);max-height:88vh;display:flex;flex-direction:column}
        .mmodal-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #eee}
        .mmodal-close{border:none;background:transparent;font-size:18px;line-height:1;padding:6px 10px;cursor:pointer;border-radius:8px}
        .mmodal-close:hover{background:#f2f2f2}
        .mmodal-scroll{padding:8px 20px 16px;overflow:auto}
        .mmodal-section{padding:16px 0;border-bottom:1px dashed #e8e8e8}
        .mmodal-section:last-child{border-bottom:none}
        .mmodal-section-title{font-size:16px;margin:0 0 8px 0}
        .mmodal-section-body :where(p,li){line-height:1.6}
        .mmodal-footer{display:flex;justify-content:flex-end;gap:8px;padding:12px 20px;border-top:1px solid #eee}
        .mmodal-btn{background:#111;color:#fff;border:none;border-radius:10px;padding:10px 14px;font-weight:600;cursor:pointer}
        .mmodal-btn:hover{opacity:.9}
      `}</style>
        </div>
    );
}

const LoginPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState("form");
    const [role, setRole] = useState("Employer");
    const [otp, setOtp] = useState("");
    const [mobile, setMobile] = useState("");
    const [name, setName] = useState("");

    const [otpError, setOtpError] = useState("");
    const [otpSuccess, setOtpSuccess] = useState("");

    const [consentChecked, setConsentChecked] = useState(false);
    const [showPolicies, setShowPolicies] = useState(false);

    const policySections = useMemo(
        () => [
            { title: "Terms & Conditions", html: TERMS_HTML },
            { title: "Privacy Policy", html: PRIVACY_HTML },
            { title: "Wallet & Credits Policy", html: WALLET_HTML },
            { title: "Refund Policy", html: REFUND_HTML },
        ],
        []
    );

    // Auto-open policies modal 1s after switching to Sign Up
    useEffect(() => {
        let t;
        if (!isLogin) {
            t = setTimeout(() => setShowPolicies(true), 1000);
        } else {
            setShowPolicies(false);
        }
        return () => t && clearTimeout(t);
    }, [isLogin]);

    const toggleForm = () => {
        setIsLogin((v) => !v);
        setConsentChecked(false);
    };

    // const handleSubmit = async (event) => {
    //     event.preventDefault();

    //     if (!name.trim()) {
    //         alert("Please enter your name");
    //         return;
    //     }
    //     if (!validator.isMobilePhone(String(mobile), "en-IN")) {
    //         alert("Enter a valid Indian mobile number");
    //         return;
    //     }
    //     if (!isLogin && !consentChecked) {
    //         alert("Please review and accept the policies to sign up.");
    //         setShowPolicies(true);
    //         return;
    //     }

    //     try {
    //         const url = isLogin ? "/api/users/login" : "/api/users/signup";
    //         const payload = { name: name.trim().toLowerCase(), phone: mobile, userType: role };

    //         const response = await api.post(url, payload);
    //         const resp = response.data;
    //         if (!resp?.success) {
    //             alert((resp?.message || "Request failed") + (resp?.error ? `: ${resp.error}` : ""));
    //             return;
    //         }
    //         setStep("otp");
    //     } catch (err) {
    //         console.error(err);
    //         alert("Something went wrong. Try again");
    //     }
    // };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name.trim()) {
            alert("Please enter your name");
            return;
        }
        if (!validator.isMobilePhone(String(mobile), "en-IN")) {
            alert("Enter a valid Indian mobile number");
            return;
        }
        if (!isLogin && !consentChecked) {
            alert("Please review and accept the policies to sign up.");
            setShowPolicies(true);
            return;
        }

        try {
            // Normal URL/payload for user login or signup
            var url = isLogin ? "/api/users/login" : "/api/users/signup";
            var payload = { name: name.trim().toLowerCase(), phone: mobile, userType: role };

            // 👉 If it's a signup and BusinessOwner, call bootstrap first
            if (!isLogin && role === "BusinessOwner") {
                    url = "/api/users/shops/signup";
            }
            if(isLogin && role === "BusinessOwner") {
                url = "/api/users/shops/login";
            }

            // Continue with the normal login/signup flow
            const response = await api.post(url, payload);
            const resp = response.data;
            if (!resp?.success) {
                alert((resp?.message || "Request failed") + (resp?.error ? `: ${resp.error}` : ""));
                return;
            }
            setStep("otp");
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Try again");
        }
    };


    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setOtpError("");
        setOtpSuccess("");
        try {
            
            var url = isLogin ? "/api/users/otp-verify" : "/api/users/signup-otp-verify";

            if(role === "BusinessOwner" && isLogin) {
                url = "api/users/shops/verify-otp-login";
            }
            
            if(role === "BusinessOwner" && !isLogin) {
                url = "api/users/shops/verify-otp-signup";
            }

            const response = await api.post(url, { name, phone: mobile, userType: role, otp });
            const resp = response.data;
            if (!resp?.success) {
                alert(resp?.message || "OTP verification failed");
                return;
            }
            const token = resp.token || resp.authToken;
            if (token) localStorage.setItem("authToken", token);
            console.log(JSON.stringify(resp.shop));
            if (resp.userId) localStorage.setItem("userId", resp.userId);
            if (resp.shop) localStorage.setItem("shopId", resp.shop.id);
            localStorage.setItem("userType", role);
            navigate(resp.forwardLink || resp.redirectUrl || "/");
        } catch (err) {
            console.error(err?.message || err);
            alert("Something went wrong. Try again");
        }
    };

    const handleResendOtp = async () => {
        setOtpError("");
        setOtpSuccess("");
        try {
            const url = "/api/users/resend-otp";
            const response = await api.post(url, { name, phone: mobile, userType: role });
            const data = response.data;
            if (data?.success) setOtpSuccess("OTP resent successfully!");
            else setOtpError(data?.message || "Failed to resend OTP. Try again later.");
        } catch {
            setOtpError("Server error. Try again.");
        }
    };

    return (
        <div className="login-page">
            <header className="header">
                <div className="header-brand">
                    <h1>MazdoorMitr</h1>
                </div>
                <nav className="header-nav">
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/contact">Contact</a>
                </nav>
            </header>

            {step === "form" ? (
                <div className="login-container">
                    <h1>{isLogin ? "Login" : "Sign Up"}</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                required
                                id="loginName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Mobile Number:</label>
                            <input
                                type="tel"
                                placeholder="Enter your mobile number"
                                required
                                id="loginMobileNumber"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                inputMode="numeric"
                                autoComplete="tel"
                            />
                        </div>

                        <div className="form-group">
                            <label>Role:</label>
                            <div className="role-selection">
                                <label>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="Employer"
                                        checked={role === "Employer"}
                                        onChange={(e) => setRole(e.target.value)}
                                    />
                                    User
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="Labourer"
                                        checked={role === "Labourer"}
                                        onChange={(e) => setRole(e.target.value)}
                                    />
                                    Worker
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="BusinessOwner"
                                        checked={role === "BusinessOwner"}
                                        onChange={(e) => setRole(e.target.value)}
                                    />
                                    Business Owner
                                </label>
                            </div>
                            <small className="role-hint">
                                * Choose “Business Owner” if you run a shop etc we can recommend to employers/labourers.
                            </small>
                            <br />
                            <small className="role-hint">
                                * Choose "User" if you want to hire or to purchase something.
                            </small>
                        </div>


                        {/* Consent visible & required ONLY for Sign Up */}
                        {!isLogin && (
                            <div className="form-group">
                                <div className="consent-field">
                                    <label htmlFor="consentCheckbox" className="consent-label">
                                        <input
                                            id="consentCheckbox"
                                            type="checkbox"
                                            checked={!!consentChecked}
                                            onChange={(e) => setConsentChecked(e.target.checked)}
                                            required
                                        />

                                        I agree to the Terms, Privacy, Wallet & Refund policies.

                                        <span
                                            role="link"
                                            tabIndex={0}
                                            onClick={() => setShowPolicies(true)}
                                            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setShowPolicies(true)}
                                            style={{ textDecoration: "underline", marginLeft: 8, cursor: "pointer", color: "#007bff" }}
                                        >
                                            Read more
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )}

                        <button type="submit" className={isLogin ? "next-btn" : "signup-btn"}>
                            {isLogin ? "Login" : "Sign Up"}
                        </button>
                    </form>

                    <p className="toggle-link" onClick={toggleForm} role="button" tabIndex={0}>
                        {isLogin ? "Don't have an account? Sign up here." : "Already have an account? Login here."}
                    </p>
                </div>
            ) : (
                <div className="otp-container">
                    <h2>Enter OTP</h2>
                    <form onSubmit={handleVerifyOtp}>
                        <div className="form-group">
                            <input
                                type="text"
                                maxLength="6"
                                placeholder="Enter 6-digit OTP"
                                required
                                id="otpInput"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                inputMode="numeric"
                            />
                        </div>

                        <button type="submit" className="verify-btn">Verify OTP</button>

                        <p className="resend-link" onClick={handleResendOtp} role="button" tabIndex={0}>
                            Didn't receive the OTP? <span>Resend</span>
                        </p>

                        {otpSuccess && <p className="otp-success">{otpSuccess}</p>}
                        {otpError && <p className="otp-error">{otpError}</p>}
                    </form>
                </div>
            )}

            {/* Auto-open Policies Modal on Sign Up */}
            <PolicyModal open={showPolicies} onClose={() => setShowPolicies(false)} sections={policySections} />

            <footer className="landing-page-footer">
                <div className="footer-links">
                    <a href="/about-us">About Us</a>
                    <a href="/terms-and-conditions">Terms & Conditions</a>
                    <a href="/privacy-policy">Privacy Policy</a>
                     <a href="/shipping-policy">Shipping Policy</a>
                    <a href="/refund-policy">Refund Policy</a>
                    <a href="/contact-us">Contact Us</a>
                </div>
                <p>© 2025 MazdoorMitr. Empowering India’s Workforce.</p>
            </footer>
        </div>
    );
};

export default LoginPage;
