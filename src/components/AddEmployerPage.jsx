import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import "./AddEmployerPage.css";

const AddEmployerPage = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    otp: "",
    location: "",
    image: null,
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, image: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendOtp = async () => {
    if (!form.name.trim()) return alert("Name is required");
    if (!form.phone.trim()) return alert("Phone is required");

    try {
      await axiosInstance.post("/api/users/protected/simple-send-otp", {
        name: form.name,
        phone: form.phone,
        workerType: "Employer",
      });
      setOtpSent(true);
      setOtpVerified(false);
      alert("OTP sent successfully.");
    } catch (err) {
      console.error("Failed to send OTP:", err);
      alert("Failed to send OTP.");
    }
  };

  const verifyOtp = async () => {
    if (!form.otp.trim()) return alert("Enter OTP");
    try {
      const res = await axiosInstance.post("/api/users/protected/simple-verify-otp", {
        name: form.name,
        phone: form.phone,
        otp: form.otp,
      });
      if (res.data.success) {
        alert("OTP verified.");
        setOtpVerified(true);
      } else {
        alert("OTP verification failed.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      alert("Error verifying OTP.");
    }
  };

  const registerEmployer = async (e) => {
    e.preventDefault();
    if (!otpVerified) return alert("Please verify OTP before registering.");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      formData.append("userType", "Employer");

      const res = await axiosInstance.post("/api/users/protected/register-employer", formData);
      if (res.data.success) {
        alert("Employer registered successfully!");
        setForm({
          name: "",
          phone: "",
          email: "",
          otp: "",
          location: "",
          image: null,
        });
        setImagePreview(null);
        setOtpSent(false);
        setOtpVerified(false);
      } else {
        alert("Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Error registering employer.");
    }
  };

  return (
    <div className="add-employer-wrapper">
      <header className="add-employer-header">
        <h1 className="add-employer-title">Add Employer</h1>
      </header>

      <main className="add-employer-container">
        <form className="add-employer-form" onSubmit={registerEmployer}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Mobile Number:
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={sendOtp} className="add-employer-otp-btn">
              Send OTP
            </button>
          </label>

          {otpSent && (
            <>
              <label>
                Enter OTP:
                <input
                  type="text"
                  name="otp"
                  value={form.otp}
                  onChange={handleChange}
                  required
                />
              </label>
              <button
                type="button"
                className="add-employer-verify-btn"
                onClick={verifyOtp}
              >
                Verify OTP
              </button>
            </>
          )}

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Location:
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Upload Image:
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>

          {imagePreview && (
            <div className="add-employer-image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}

          <button type="submit" className="add-employer-submit-btn">
            Register Employer
          </button>
        </form>
      </main>

      <footer className="add-employer-footer">
        <p>&copy; 2025 MazdoorMitr Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AddEmployerPage;
