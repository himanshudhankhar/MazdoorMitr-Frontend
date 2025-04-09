import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import api from '../axiosConfig';
import validator from 'validator';

const LoginPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState("form");
    const [role, setRole] = useState("Employer");
    const [otp, setOtp] = useState("");
    const [mobile, setMobileNumber] = useState("");
    const [name, setName] = useState("");
    const [userType, setUserType] = useState("");
    const [otpError, setOtpError] = useState("");
    const [otpSuccess, setOtpSuccess] = useState("");

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setOtpError("");
        setOtpSuccess("");

        try {
            var url = "/api/users/otp-verify";
            if (!isLogin) {
                url = "/api/users/signup-otp-verify";
            }
            const otp = document.getElementById('otpInput').value;
            const response = await api.post(url, { name, phone: mobile, userType: userType, otp });
            console.log('response', JSON.stringify(response.data));
            var resp = response.data;
            var status = response.status;
            if (resp.success == undefined || resp.success == false || status >= 400) {
                alert(resp.message);
            } else {
                console.log("response", resp)
                const token = resp.token || resp.authToken; // assuming backend returns the token
                localStorage.setItem("authToken", token);
                navigate("/home");
            }
            //redirect
        } catch (error) {
            alert("Something went wrong. Try again");
            console.log(error.message);
        }
    };

    const handleResendOtp = async () => {
        setOtpError("");
        setOtpSuccess("");

        try {
            const url = "/api/users/resend-otp"
            const response = await api.post(url, { name, phone: mobile, userType: role });
            console.log('response', response.data);
            if (!data.success) {
                alert(resp.message);
            }
            const data = await response.json();

            if (data.success) {
                setOtpSuccess("OTP resent successfully!");
            } else {
                setOtpError("Failed to resend OTP. Try again later.");
            }
        } catch (error) {
            setOtpError("Server error. Try again.");
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        var nameEntered = document.getElementById("loginName").value.toLowerCase();
        const mobileNumber = document.getElementById("loginMobileNumber").value;
        console.log({ name, mobileNumber, role });
        if (!validator.isMobilePhone(mobileNumber)) {
            alert('Enter a valid mobile number');
            return;
        } else {
            var url = "/api/users/login";
            if (!isLogin) {
                url = "/api/users/signup";
            }
            setName(nameEntered);
            setMobileNumber(mobileNumber);
            setUserType(role);
            const response = await api.post(url, { name: nameEntered, phone: mobileNumber, userType: role });
            var resp = response.data;
            if (!resp.success) {
                alert(resp.message + resp.error);
            } else {
                setStep("otp");
            }
        }
    }



    return (
        <div className="login-page">
            <header class="header">
                <div class="header-brand">
                    <h1>MazdoorMitr</h1>
                </div>
                <nav class="header-nav">
                    <a href="/landing">Home</a>
                    <a href="/about">About</a>
                    <a href="/contact">Contact</a>
                </nav>
            </header>
            {step === "form" ?
                (<div className="login-container">
                    <h1>{isLogin ? "Login" : "Sign Up"}</h1>

                    <form>
                        <div className="form-group">
                            <label>Name:</label>
                            <input type="text" placeholder="Enter your name" required id="loginName" />
                        </div>

                        <div className="form-group">
                            <label>Mobile Number:</label>
                            <input type="tel" placeholder="Enter your mobile number" required id="loginMobileNumber" />
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
                                    Employer
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="Labourer"
                                        checked={role === "Labourer"}
                                        onChange={(e) => setRole(e.target.value)}
                                    />
                                    Labourer
                                </label>
                            </div>
                        </div>

                        {isLogin ? (
                            <button type="submit" className="next-btn" onClick={handleSubmit}>
                                Login
                            </button>
                        ) : (
                            <button type="submit" className="signup-btn" onClick={handleSubmit}>
                                Sign Up
                            </button>
                        )}
                    </form>

                    <p className="toggle-link" onClick={toggleForm}>
                        {isLogin
                            ? "Don't have an account? Sign up here."
                            : "Already have an account? Login here."}
                    </p>
                </div>) :
                (<div className="otp-container">
                    <h2>Enter OTP</h2>

                    <form>
                        <div className="form-group">
                            <input
                                type="text"
                                maxLength="6"
                                placeholder="Enter 6-digit OTP"
                                required
                                id="otpInput"
                            />
                        </div>

                        <button type="submit" className="verify-btn" onClick={handleVerifyOtp}>
                            Verify OTP
                        </button>

                        <p className="resend-link" onClick={handleResendOtp}>
                            Didn't receive the OTP? <span>Resend</span>
                        </p>
                    </form>
                </div>)}


            <footer className="footer-login">
                <p>&copy; 2025 MazdoorMitr. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LoginPage;

