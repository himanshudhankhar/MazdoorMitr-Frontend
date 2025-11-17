import React, { useState, useEffect } from "react";
import "./Profile.css";
import axiosInstance from "../axiosConfig";
import { useNavigate } from "react-router-dom";


const Profile = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        profileImage: "",
        name: "",
        location: "",
        skills: "",
        phone: "",
        email: "",
        callTimeStart: "",
        callTimeEnd: "",
        userType: "", // employer or labourer
    });

    useEffect(() => {
        const userType = localStorage.getItem("userType");

        // If BusinessOwner tries to open Profile, redirect instantly
        if (userType === "BusinessOwner") {
            navigate("/app/home");
            return; // Stop further execution
        }
        const fetchProfile = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const res = await axiosInstance.post("/api/users/protected/get-profile", { id: userId }, { withCredentials: true });
                const data = res.data.profile;

                setProfileData({
                    profileImage: data.imageUrl || data.profileImage || "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?w=1060",
                    name: data.name || "",
                    location: data.location || "",
                    skills: data.skills || "",
                    phone: data.contactNumber || "",
                    email: data.email || "",
                    callTimeStart: data.callTimeStart || "",
                    callTimeEnd: data.callTimeEnd || "",
                    userType: data.userType || "labourer",
                });
            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            const updatedProfile = {
                id: localStorage.getItem("userId"),
                name: profileData.name,
                location: profileData.location,
                skills: profileData.skills,
                contactNumber: profileData.phone,
                email: profileData.email,
                callTimeStart: profileData.callTimeStart,
                callTimeEnd: profileData.callTimeEnd,
            };

            await axiosInstance.post("/api/users/protected/update-profile", updatedProfile, { withCredentials: true });
            alert("Profile updated successfully!");
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("Failed to update profile!");
        }
    };

    return (
        <div className="profile-container">
            {/* Profile Header */}
            <div className="profile-header">
                <img
                    src={profileData.profileImage}
                    alt="Profile"
                    className="profile-picture"
                />
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            name="name"
                            value={profileData.name}
                            onChange={handleChange}
                            placeholder="Name"
                            className="edit-input"
                        />
                        <input
                            type="text"
                            name="location"
                            value={profileData.location}
                            onChange={handleChange}
                            placeholder="Location"
                            className="edit-input"
                        />
                        {profileData.userType === "Labourer" && (
                            <input
                                type="text"
                                name="skills"
                                value={profileData.skills}
                                onChange={handleChange}
                                placeholder="Skills (comma separated)"
                                className="edit-input"
                            />
                        )}
                    </>
                ) : (
                    <>
                        <h1 className="profile-name">{profileData.name}</h1>
                        {/* 👇 This is the new heading showing Employer/Labourer */}
                        <h2 style={{ fontSize: "1.2rem", color: "#555", margin: "5px 0" }}>
                            {profileData.userType === "Employer" ? "Employer" : "Labourer"}
                        </h2>
                        <p className="profile-location">{profileData.location}</p>
                        {profileData.userType === "Labourer" && (
                            <p className="profile-location">
                                <strong>Skills:</strong> {profileData.skills}
                            </p>
                        )}
                    </>
                )}
                <button className="edit-button" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Cancel" : "Edit Profile"}
                </button>
            </div>

            {/* Contact Information */}
            <div className="profile-section">
                <h2>Contact Information</h2>
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            className="edit-input"
                        />
                        {profileData.userType === "Employer" && (
                            <input
                                type="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className="edit-input"
                            />
                        )}
                        <div className="timing-inputs">
                            <input
                                type="time"
                                name="callTimeStart"
                                value={profileData.callTimeStart}
                                onChange={handleChange}
                            />
                            <span>to</span>
                            <input
                                type="time"
                                name="callTimeEnd"
                                value={profileData.callTimeEnd}
                                onChange={handleChange}
                            />
                        </div>
                        <button className="save-button" onClick={handleSave}>
                            Save
                        </button>
                    </>
                ) : (
                    <>
                        <p><strong>Phone:</strong> {profileData.phone}</p>
                        {profileData.userType === "Employer" && (
                            <p><strong>Email:</strong> {profileData.email}</p>
                        )}
                        <p><strong>Preferred Call Timings:</strong> {profileData.callTimeStart} - {profileData.callTimeEnd}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
