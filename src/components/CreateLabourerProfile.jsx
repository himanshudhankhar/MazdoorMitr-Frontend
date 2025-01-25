import React, { useState } from "react";
import "./CreateLabourerProfile.css";

const CreateLabourerProfile = () => {
    const [profileImage, setProfileImage] = useState(null);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [skills, setSkills] = useState("");
    const [callTimeStart, setCallTimeStart] = useState("");
    const [callTimeEnd, setCallTimeEnd] = useState("");

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Perform the form submission logic here
        console.log({
            profileImage,
            name,
            location,
            contactNumber,
            skills,
            callTimeStart,
            callTimeEnd,
        });
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
                        {profileImage && (
                            <div className="image-preview">
                                <img src={profileImage} alt="Preview" />
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
