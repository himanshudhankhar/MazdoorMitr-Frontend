import React, { useState } from "react";
import "./AddEmployer.css";

const AddEmployer = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    otp: "",
    location: "",
    companyName: "",
    profileImage: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendOtp = () => {
    if (formData.mobileNumber.length === 10) {
      setOtpSent(true);
      setStep(2);
      alert("OTP Sent to " + formData.mobileNumber);
    } else {
      alert("Enter a valid 10-digit mobile number.");
    }
  };

  const verifyOtp = () => {
    if (formData.otp === "1234") { // Dummy OTP for now
      setVerified(true);
      setStep(3);
    } else {
      alert("Invalid OTP. Try again!");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
    }
  };

  const handleSubmit = () => {
    console.log("Employer Data Submitted:", formData);
    alert("Employer added successfully!");
    setStep(1);
    setFormData({ name: "", mobileNumber: "", otp: "", location: "", companyName: "", profileImage: "" });
    setOtpSent(false);
    setVerified(false);
    setImagePreview(null);
  };

  return (
    <div className="add-employer-container">
      <header className="add-employer-header">
        <h1>Add Employer</h1>
      </header>

      {step === 1 && (
        <div className="add-employer-step">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter Name" />
          <label>Mobile Number:</label>
          <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="Enter Mobile Number" />
          <button onClick={sendOtp} className="add-employer-btn">Send OTP</button>
        </div>
      )}

      {step === 2 && otpSent && (
        <div className="add-employer-step">
          <label>Enter OTP:</label>
          <input type="text" name="otp" value={formData.otp} onChange={handleChange} placeholder="Enter OTP" />
          <button onClick={verifyOtp} className="add-employer-btn">Verify OTP</button>
        </div>
      )}

      {step === 3 && verified && (
        <div className="add-employer-form">
          <h2>Employer Details</h2>
          <div className="add-employer-form-group">
            <label>Profile Image:</label>
            {imagePreview && <img src={imagePreview} alt="Employer" className="add-employer-image-preview" />}
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
          <div className="add-employer-form-group">
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="add-employer-form-group">
            <label>Mobile Number:</label>
            <input type="text" name="mobileNumber" value={formData.mobileNumber} disabled />
          </div>
          <div className="add-employer-form-group">
            <label>Location:</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} />
          </div>
          <div className="add-employer-form-group">
            <label>Company Name:</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} />
          </div>

          <button onClick={handleSubmit} className="add-employer-submit-btn">Add Employer</button>
        </div>
      )}

      <footer className="add-employer-footer">
        <p>&copy; 2025 MazdoorMitr. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AddEmployer;
