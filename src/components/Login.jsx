import React, { useState } from "react";
import "./LoginPage.css";

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState("Employer");

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="login-page">
            <header class="header">
                 <div class="header-brand">
                     <h1>MazdoorMitr</h1>
                 </div>
                 <nav class="header-nav">
                     <a href="/">Home</a>
                     <a href="/about">About</a>
                     <a href="/contact">Contact</a>
                 </nav>
             </header>

            <div className="login-container">
                <h1>{isLogin ? "Login" : "Sign Up"}</h1>

                <form>
                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text" placeholder="Enter your name" required />
                    </div>

                    <div className="form-group">
                        <label>Mobile Number:</label>
                        <input type="tel" placeholder="Enter your mobile number" required />
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
                        <button type="submit" className="next-btn">
                            Login
                        </button>
                    ) : (
                        <button type="submit" className="signup-btn">
                            Sign Up
                        </button>
                    )}
                </form>

                <p className="toggle-link" onClick={toggleForm}>
                    {isLogin
                        ? "Don't have an account? Sign up here."
                        : "Already have an account? Login here."}
                </p>
            </div>

            <footer className="footer-login">
                <p>&copy; 2025 MazdoorMitr. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LoginPage;

