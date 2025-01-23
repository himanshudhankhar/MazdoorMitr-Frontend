import React from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
    return (
        <div className="profile-page-container">
            <div className="profile-header">
                <img
                    src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?w=1060"
                    alt="Profile"
                    className="profile-picture"
                />
                <h1 className="profile-name">John Doe</h1>
                <p className="profile-profession">Carpenter</p>
                <p className="profile-location">Delhi, India</p>
            </div>

            <div className="profile-section">
                <h2>Work Experience</h2>
                <ul className="experience-list">
                    <li>5 years experience in furniture making</li>
                    <li>Specialized in custom wooden furniture</li>
                    <li>Worked on over 50+ projects</li>
                </ul>
            </div>

            <div className="profile-section">
                <h2>Skills</h2>
                <ul className="skills-list">
                    <li>Woodworking</li>
                    <li>Furniture Assembly</li>
                    <li>Blueprint Reading</li>
                </ul>
            </div>

            <div className="profile-section">
                <h2>Availability</h2>
                <p>Monday to Saturday: 9:00 AM - 6:00 PM</p>
            </div>

            <div className="profile-section">
                <h2>Ratings and Reviews</h2>
                <p>Rating: 4.5/5</p>
                <ul className="reviews-list">
                    <li>"Great craftsmanship! Highly recommend."</li>
                    <li>"Delivered on time and with excellent quality."</li>
                </ul>
            </div>

            <div className="profile-actions">
                <button className="action-button hire-button">Hire Now</button>
                <button className="action-button report-button">Report Profile</button>
                <button className="action-button share-button">Share Profile</button>
            </div>
        </div>
    );
};

export default ProfilePage;
