import React from 'react';
import './Home.css';

export default function Home() {
    return (
        <div className="home-container">
            <h1 className="heading">Search Profiles</h1>
            <div className="search-bar-container">
                <input 
                    type="text" 
                    className="search-bar" 
                    placeholder="Search profiles here..." 
                />
            </div>
            <h2 className="subheading">Today's Top Performers</h2>
            <div className="profile-card-row">
                <div className="profile-card">
                    <img 
                        src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?w=1060" 
                        alt="Person" 
                        className="profile-image"
                    />
                    <div className="profile-info">
                        <h3 className="profile-name">John Doe</h3>
                        <p className="profile-profession">Carpenter</p>
                        <p className="profile-address">Delhi, India</p>
                    </div>
                </div>
                <div className="profile-card">
                    <img 
                        src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?w=1060" 
                        alt="Person" 
                        className="profile-image"
                    />
                    <div className="profile-info">
                        <h3 className="profile-name">Jane Smith</h3>
                        <p className="profile-profession">Electrician</p>
                        <p className="profile-address">Mumbai, India</p>
                    </div>
                </div>
                <div className="profile-card">
                    <img 
                        src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?w=1060" 
                        alt="Person" 
                        className="profile-image"
                    />
                    <div className="profile-info">
                        <h3 className="profile-name">Raj Kumar</h3>
                        <p className="profile-profession">Plumber</p>
                        <p className="profile-address">Kolkata, India</p>
                    </div>
                </div>
            </div>
        </div>
    )
}