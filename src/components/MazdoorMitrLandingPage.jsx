import React from 'react';
import './MazdoorMitrLandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      <header className="landing-page-header">
        <h1 className="landing-page-title">MazdoorMitr</h1>
        <p className="landing-page-tagline">Your Desi-LinkedIn for Daily Wage and Skilled Workers & Employers</p>
        <a href="/login" className="landing-page-cta-button">Join Now</a>
      </header>

      <section className="landing-page-section">
        <h2 className="landing-page-section-title">For Workers</h2>
        <div className="landing-page-cards">
          <div className="landing-page-card">
            <h3>Earn from Views</h3>
            <p>Get ₹10 every time an employer views your contact — your time matters!</p>
          </div>
          <div className="landing-page-card">
            <h3>Work Opportunities Worldwide</h3>
            <p>Be visible to employers not just nearby, but across India and abroad.</p>
          </div>
          <div className="landing-page-card">
            <h3>Build Your Reputation</h3>
            <p>Create a profile showcasing your skills, reviews & experience.</p>
          </div>
        </div>
      </section>

      <section className="landing-page-section alt-section">
        <h2 className="landing-page-section-title">For Employers</h2>
        <div className="landing-page-cards">
          <div className="landing-page-card">
            <h3>Access Skilled Workers Easily</h3>
            <p>Search and hire verified daily wage & skilled workers for any project.</p>
          </div>
          <div className="landing-page-card">
            <h3>Save on Hiring Costs</h3>
            <p>Hire at competitive rates without compromising on quality.</p>
          </div>
          <div className="landing-page-card">
            <h3>Hire Globally, Pay Locally</h3>
            <p>Post projects across regions and access a large labor pool instantly.</p>
          </div>
        </div>
      </section>

      <footer className="landing-page-footer">
        <p>© 2025 MazdoorMitr. Empowering India’s Workforce.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
