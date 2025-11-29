import React from 'react';
import './MazdoorMitrLandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      <header className="landing-page-header">
        <h1 className="landing-page-title">MazdoorMitr</h1>
        <p className="landing-page-tagline">
          काम, मज़दूर और दुकानें – सब एक ही जगह
        </p>
        <p className="landing-page-subtagline">
          Daily wage workers, employers, and local shops together on one platform.
        </p>

        <div className="landing-page-cta-group">
          <a href="/login" className="landing-page-cta-button">
            👤 Login/Signup as Worker / Employer or as a 🏪 Shop / Business
          </a>
          {/* <a href="/login" className="landing-page-cta-button secondary">
            Login as 
          </a> */}
        </div>
      </header>

      {/* Workers */}
      <section className="landing-page-section">
        <h2 className="landing-page-section-title">For Workers</h2>
        <div className="landing-page-cards">
          <div className="landing-page-card">
            <h3>Earn from Views</h3>
            <p>Get ₹10 every time an employer views your contact — your time matters!</p>
          </div>
          <div className="landing-page-card">
            <h3>More Work Opportunities</h3>
            <p>Be visible to employers nearby and across India through your Mazdoormitr profile.</p>
          </div>
          <div className="landing-page-card">
            <h3>Build Your Reputation</h3>
            <p>Create a profile showcasing your skills, reviews, experience and preferred timings.</p>
          </div>
        </div>
      </section>

      {/* Employers */}
      <section className="landing-page-section alt-section">
        <h2 className="landing-page-section-title">For Employers</h2>
        <div className="landing-page-cards">
          <div className="landing-page-card">
            <h3>Find the Right Worker Fast</h3>
            <p>Search and hire daily wage & skilled workers as per skill, location and availability.</p>
          </div>
          <div className="landing-page-card">
            <h3>Post Jobs & Work Requirements</h3>
            <p>Create job posts or service requirements in the marketplace and let workers apply.</p>
          </div>
          <div className="landing-page-card">
            <h3>Transparent & Direct Connect</h3>
            <p>Contact workers directly, with clear charges when you view their phone number.</p>
          </div>
        </div>
      </section>

      {/* Shops / Businesses */}
      <section className="landing-page-section">
        <h2 className="landing-page-section-title">For Shops & Local Businesses</h2>
        <div className="landing-page-cards">
          <div className="landing-page-card">
            <h3>Showcase Your Shop Online</h3>
            <p>Create a digital profile for your hardware store, repair shop, or any local business.</p>
          </div>
          <div className="landing-page-card">
            <h3>List Items & Services</h3>
            <p>Add items you sell and services you provide, along with prices and timings.</p>
          </div>
          <div className="landing-page-card">
            <h3>Get More Local Customers</h3>
            <p>Appear in Mazdoormitr search when employers and workers look for nearby shops.</p>
          </div>
        </div>
      </section>

      {/* Marketplace */}
      <section className="landing-page-section alt-section">
        <h2 className="landing-page-section-title">Mazdoormitr Marketplace</h2>
        <div className="landing-page-cards">
          <div className="landing-page-card">
            <h3>Job Posts</h3>
            <p>Employers can post short or long term jobs and workers can apply directly.</p>
          </div>
          <div className="landing-page-card">
            <h3>Service Requests</h3>
            <p>Need a plumber, painter, electrician or mason? Post your requirement in minutes.</p>
          </div>
          <div className="landing-page-card">
            <h3>Buy / Sell & Other Needs</h3>
            <p>Post requirements to buy materials, tools or get small works done by shops or workers.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-page-footer">
        <div className="footer-links">
          <a href="/about-us">About Us</a>
          <a href="/terms-and-conditions">Terms & Conditions</a>
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/refund-policy">Refund Policy</a>
          <a href="/contact-us">Contact Us</a>
        </div>
        <p>© 2025 MazdoorMitr. Empowering India’s Workforce, Shops & Marketplace.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
