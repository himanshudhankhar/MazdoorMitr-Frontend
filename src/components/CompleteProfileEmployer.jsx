import React, { useState } from "react";
import "./CompleteProfileEmployer.css";

const CompleteProfile = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [callTimeStart, setCallTimeStart] = useState("");
  const [callTimeEnd, setCallTimeEnd] = useState("");

  const handleImageUpload = (e) => {
    setProfilePic(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = () => {
    const profileData = {
      profilePic,
      location,
      contactNumber,
      email,
      callTimeStart,
      callTimeEnd,
    };
    console.log("Profile Data Submitted:", profileData);
    alert("Profile completed successfully!");
  };

  return (
    <div className="complete-profile-container">
      <h1>Complete Your Profile As Employer</h1>

      <div className="form-group">
        <label>Profile Picture:</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {profilePic && <img src={profilePic} alt="Profile Preview" className="profile-pic-preview" />}
      </div>

      <div className="form-group">
        <label>Location:</label>
        <input
          type="text"
          placeholder="Enter your location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Contact Number:</label>
        <input
          type="tel"
          placeholder="Enter your contact number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Email (Optional):</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

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

      <button className="submit-btn" onClick={handleSubmit}>
        Save Profile
      </button>
    </div>
  );
};

export default CompleteProfile;
