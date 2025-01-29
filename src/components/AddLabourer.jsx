import React, { useState } from "react";
import "./AddLabourer.css";

const AddLabourer = () => {
    const [step, setStep] = useState(1); // Step tracker
    const [profileImage, setProfileImage] = useState(null);
    const [labourer, setLabourer] = useState({
        name: "",
        mobileNumber: "",
        otp: "",
        profilePic: null,
        location: "",
        skills: "",
        workExperience: "",
    });

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLabourer({ ...labourer, [name]: value });
    };

    const handleFileChange = (e) => {
        setLabourer({ ...labourer, profilePic: e.target.files[0] });
    };

    const handleSendOTP = () => {
        // Simulate OTP send
        console.log("Sending OTP to:", labourer.mobileNumber);
        setStep(2);
    };

    const handleVerifyOTP = () => {
        // Simulate OTP verification
        console.log("Verifying OTP:", labourer.otp);
        setStep(3);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Labourer Data Submitted:", labourer);
        alert("Labourer added successfully!");
    };

    return (
        <div className="add-labourer-container">
            <header className="add-labourer-header">
                <h1>Add Labourer</h1>
            </header>

            <div className="add-labourer-form-container">
                <form onSubmit={handleSubmit} className="add-labourer-form">
                    {step === 1 && (
                        <>
                            <div className="add-labourer-form-group">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={labourer.name}
                                    onChange={handleChange}
                                    required
                                    style={{ width: "300px" }}
                                    placeholder="Enter Name"
                                />
                            </div>
                            <div className="add-labourer-form-group">
                                <label>Mobile Number:</label>
                                <input
                                    type="tel"
                                    name="mobileNumber"
                                    value={labourer.mobileNumber}
                                    onChange={handleChange}
                                    required
                                    style={{ width: "300px" }}
                                    placeholder="9876543210"
                                />
                            </div>
                            <button type="button" className="add-labourer-submit-btn" onClick={handleSendOTP}>
                                Send OTP
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="add-labourer-form-group">
                                <label>Enter OTP:</label>
                                <input
                                    type="text"
                                    name="otp"
                                    value={labourer.otp}
                                    onChange={handleChange}
                                    required
                                    style={{ width: "300px" }}
                                />
                            </div>
                            <button type="button" className="add-labourer-submit-btn" onClick={handleVerifyOTP}>
                                Verify OTP
                            </button>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div className="form-group">
                                <label htmlFor="profileImage">Upload Photo:</label>
                                <input
                                    type="file"
                                    id="profileImage"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ width: "200px" }}
                                />
                                {profileImage && (
                                    <div className="image-preview">
                                        <img src={profileImage} alt="Preview" />
                                    </div>
                                )}
                            </div>
                            <div className="add-labourer-form-group">
                                <label>Location:</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={labourer.location}
                                    onChange={handleChange}
                                    required
                                    style={{width: '200px'}}
                                    placeholder="Enter Location"
                                />
                            </div>
                            <div className="add-labourer-form-group">
                                <label>Skills:</label>
                                {/* <input
                                    type="text"
                                    name="skills"
                                    value={labourer.skills}
                                    onChange={handleChange}
                                    required
                                /> */}
                                <textarea
                                    id="skills"
                                    name="skills"
                                    value={labourer.skills}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your skills"
                                    rows="4"
                                    style={{width: '200px'}}
                                />
                            </div>
                            <div className="add-labourer-form-group">
                                <label>Work Experience:</label>
                                {/* <input
                                    type="text"
                                    name="workExperience"
                                    value={labourer.workExperience}
                                    onChange={handleChange}
                                    required
                                /> */}
                                <textarea
                                    id="workExperience"
                                    name="workExperience"
                                    value={labourer.workExperience}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your work experience"
                                    rows="4"
                                    style={{width: '200px'}}
                                />
                            </div>
                            <button type="submit" className="add-labourer-submit-btn">Add Labourer</button>
                        </>
                    )}
                </form>
            </div>

            <footer className="add-labourer-footer">
                <p>&copy; 2025 MazdoorMitr. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default AddLabourer;
