import React from "react";
import "./quickclap.css";

export default function LandingPage() {
  return (
    <div className="quickclap-landing-page">
      {/* Hero Section */}
      <section className="quickclap-hero">
        <h1>Hire Smart. Work Freely.</h1>
        <p>
          Welcome to <strong>QuickClap.com</strong> — the fastest way to connect clients with skilled freelancers.
          Quality work. Transparent payments. Total freedom.
        </p>
        <div className="quickclap-cta-buttons">
          <button className="quickclap-btn quickclap-primary">Find Freelancers</button>
          <button className="quickclap-btn quickclap-secondary">Become a Freelancer →</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="quickclap-features">
        <h2>Why QuickClap?</h2>
        <div className="quickclap-feature-cards">
          <div className="quickclap-feature-card">
            <h3>Trusted Talent</h3>
            <p>Verified freelancers with ratings and portfolios, so you hire with confidence.</p>
          </div>
          <div className="quickclap-feature-card">
            <h3>Secure Payments</h3>
            <p>Escrow-based system ensures you only pay when work is delivered as promised.</p>
          </div>
          <div className="quickclap-feature-card">
            <h3>Instant Matchmaking</h3>
            <p>Post your needs or browse talent in real-time — hire in minutes.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="quickclap-call-to-action">
        <h2>Ready to Work or Hire?</h2>
        <p>Join thousands of freelancers and clients already using QuickClap.</p>
        <button className="quickclap-btn quickclap-primary quickclap-large">Get Started for Free</button>
      </section>

      {/* Footer */}
      <footer className="quickclap-footer">
        © {new Date().getFullYear()} QuickClap.com — Empowering Freelance Freedom
      </footer>
    </div>
  );
}
