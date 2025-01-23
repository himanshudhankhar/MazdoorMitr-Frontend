import React from 'react';
import './Profile.css';

const Profile = () => {
    return (
        <div className="employer-profile-container">
            {/* Profile Header */}
            <div className="profile-header">
                <img
                    src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?w=1060"
                    alt="Profile"
                    className="profile-picture"
                />
                <h1 className="profile-name">Jane Smith</h1>
                <p className="profile-location">Mumbai, India</p>
                <button className="edit-button">Edit Profile</button>
            </div>

            {/* Contact Information */}
            <div className="profile-section">
                <h2>Contact Information</h2>
                <p><strong>Phone:</strong> +91-9876543210</p>
                <p><strong>Preferred Call Timings:</strong> 10:00 AM - 6:00 PM</p>
            </div>

            {/* Hiring History */}
            <div className="profile-section">
                <h2>Hiring History</h2>
                <ul className="history-list">
                    <li>
                        <strong>John Doe</strong> - Carpenter (Hired on Jan 10, 2025)
                        <button className="small-button">View Details</button>
                    </li>
                    <li>
                        <strong>Mary Johnson</strong> - Electrician (Hired on Dec 20, 2024)
                        <button className="small-button">View Details</button>
                    </li>
                </ul>
            </div>

            {/* Job Postings
            <div className="profile-section">
                <h2>Job Postings</h2>
                <ul className="postings-list">
                    <li>
                        <strong>Plumbing Work Needed</strong> - Open
                        <button className="small-button">Edit</button>
                    </li>
                    <li>
                        <strong>Painting Project</strong> - Completed
                        <button className="small-button">View</button>
                    </li>
                </ul>
            </div> */}

            {/* Reviews and Ratings */}
            <div className="profile-section">
                <h2>Reviews & Ratings</h2>
                <p>Rating: 4.7/5</p>
                <ul className="reviews-list">
                    <li>"Clear instructions and timely payment!"</li>
                    <li>"Great to work with."</li>
                </ul>
            </div>

            {/* Settings */}
            <div className="profile-section">
                <h2>Settings</h2>
                <button className="small-button">Notification Preferences</button>
                <button className="small-button delete-button">Delete Account</button>
            </div>
        </div>
    );
};

export default Profile;
