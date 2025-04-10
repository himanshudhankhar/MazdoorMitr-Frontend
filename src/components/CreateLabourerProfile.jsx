import React, { useState, useEffect } from "react";
import "./CreateLabourerProfile.css";
import axios from "axios";
import axiosInstance from "../axiosConfig";

const CreateLabourerProfile = () => {
    const [profileImage, setProfileImage] = useState(null);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [skills, setSkills] = useState("");
    const [callTimeStart, setCallTimeStart] = useState("");
    const [callTimeEnd, setCallTimeEnd] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [changedImage, setChangedImage] = useState(false);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setChangedImage(true);
            setProfileImage(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            const userId = localStorage.getItem("userId");
            if (!userId) return;

            try {
                const res = await axiosInstance.post(
                    "/api/users/protected/get-profile",
                    { id: userId },
                    { withCredentials: true }
                );

                const data = res.data.profile;
                console.log("profile data", data);
                setName(data.name || "");
                setLocation(data.location || "");
                setContactNumber(data.contactNumber || "");
                setSkills(data.skills || "");
                setCallTimeStart(data.callTimeStart || "");
                setCallTimeEnd(data.callTimeEnd || "");
                if (data.imageUrl) {
                    setImageUrl(data.imageUrl);
                }

            } catch (err) {
                console.error("Failed to load profile", err);
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const fileInput = document.getElementById("profileImage");
            if(!fileInput  && !imageUrl) {
                alert("Upload Image!!");
                return;
            }
            var userId = localStorage.getItem("userId");
            const formData = new FormData();
            if(fileInput) {
            const file = fileInput.files[0];
            formData.append("file", file); // image
            }
            formData.append("name", name);
            formData.append("location", location);
            formData.append("contactNumber", contactNumber);
            formData.append("skills", skills);
            formData.append("callTimeStart", callTimeStart);
            formData.append("callTimeEnd", callTimeEnd);
            formData.append("id", userId);

            const res = await axiosInstance.post("/api/users/protected/labourer/profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true, // important for auth
            });

            if (res.status === 200) {
                alert("Profile updated successfully!");
            } else {
                alert("Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile");
        }
    };


    return (
        <div className="create-labourer-profile">
            <div className="profile-card">
                <h1>Create Labourer Profile</h1>
                <form onSubmit={handleSubmit}>
                    {/* Photo Upload */}
                    <div className="form-group">
                        <label htmlFor="profileImage">Upload Photo:</label>
                        <input
                            type="file"
                            id="profileImage"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        {(profileImage || imageUrl) && (
                            <div className="image-preview">
                                <img src={changedImage ? profileImage : imageUrl} alt="Preview" />
                            </div>
                        )}
                    </div>

                    {/* Name */}
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    {/* Location */}
                    <div className="form-group">
                        <label htmlFor="location">Location:</label>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter your location"
                            required
                        />
                    </div>

                    {/* Contact Number */}
                    <div className="form-group">
                        <label htmlFor="contactNumber">Contact Number:</label>
                        <input
                            type="tel"
                            id="contactNumber"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            placeholder="Enter your contact number"
                            required
                        />
                    </div>

                    {/* Skills */}
                    <div className="form-group">
                        <label htmlFor="skills">Skills:</label>
                        <textarea
                            id="skills"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            placeholder="Enter your skills"
                            rows="4"
                            required
                        />
                    </div>

                    {/* Preferable Call Timings */}
                    <div className="form-group">
                        <label>Preferable Call Timings:</label>
                        <div className="timing-inputs">
                            <input
                                type="time"
                                value={callTimeStart}
                                onChange={(e) => setCallTimeStart(e.target.value)}
                            />
                            <span>to</span>
                            <input
                                type="time"
                                value={callTimeEnd}
                                onChange={(e) => setCallTimeEnd(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn">
                        Save Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateLabourerProfile;
