import React, { useState, useEffect } from "react";
import "./CompleteProfileEmployer.css";
import axiosInstance from "../axiosConfig";
import { useNavigate } from "react-router-dom";
 
const CompleteProfile = () => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [callTimeStart, setCallTimeStart] = useState("");
  const [callTimeEnd, setCallTimeEnd] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [changedImage, setChangedImage] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setChangedImage(true);
      setProfilePic(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await axiosInstance.post(
          "/api/users/protected/get-profile",
          { id: userId, userTypeRequired: "Employer" },
          { withCredentials: true }
        );

        const data = res.data.profile;
        console.log("profile data", data);
        setName(data.name || "");
        setLocation(data.location || "");
        setContactNumber(data.contactNumber || "");
        setEmail(data.email || "");
        setCallTimeStart(data.callTimeStart || "");
        setCallTimeEnd(data.callTimeEnd || "");
        if (data.imageUrl) {
          setImageUrl(data.imageUrl);
        }

      } catch (err) {
        console.error("Failed to load profile", err.response.data.message);
        if (err.response.data.message == "User Type mismatch") {
          alert("You are not registered as Employer!");
          navigate("/home");
        }
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (event) => {
    //////////////////////////////
    event.preventDefault();

    try {
      const fileInput = document.getElementById("profilePic");
      if (!fileInput && !imageUrl) {
        alert("Upload Image!!");
        return;
      }
      var userId = localStorage.getItem("userId");
      const formData = new FormData();
      if (fileInput) {
        const file = fileInput.files[0];
        formData.append("file", file); // image
      }
      formData.append("name", name);
      formData.append("location", location);
      formData.append("contactNumber", contactNumber);
      formData.append("email", email);
      formData.append("callTimeStart", callTimeStart);
      formData.append("callTimeEnd", callTimeEnd);
      formData.append("id", userId);

      const res = await axiosInstance.post("/api/users/protected/employer/profile", formData, {
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
    /////////////////////////////
  };

  return (
    <div className="complete-profile-container">
      <h1>Complete Your Profile As Employer</h1>

      <div className="form-group">
        <label>Profile Picture:</label>
        <input type="file" accept="image/*" id="profilePic" onChange={handleImageUpload} />
        {(profilePic || imageUrl) && (
          <div className="image-preview">
            <img src={changedImage ? profilePic : imageUrl} alt="Preview" />
          </div>
        )}
        {/* {profilePic && <img src={profilePic} alt="Profile Preview" className="profile-pic-preview" />} */}
      </div>

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
