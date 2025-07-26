// AddEmployeePage.jsx
import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import "./AddEmployeePage.css";

const AddEmployeePage = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    otp: "",
    dob: "",
    aadhaar: null,
    personImage: null,
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [aadhaarPreview, setAadhaarPreview] = useState(null);
  const [personPreview, setPersonPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, [type]: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "aadhaar") setAadhaarPreview(reader.result);
      if (type === "personImage") setPersonPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const sendOtp = async () => {
    if (!form.phone || !form.name) {
      alert("Name and phone are required before sending OTP.");
      return;
    }

    try {
      await axiosInstance.post("/api/users/send-otp", { phone: form.phone });
      setOtpSent(true);
      setOtpVerified(false);
      alert("OTP sent successfully.");
    } catch (err) {
      console.error("Failed to send OTP:", err);
      alert("Failed to send OTP.");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axiosInstance.post("/api/users/verify-otp", {
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
      console.error("Failed to verify OTP:", err);
      alert("OTP verification error.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      alert("Please verify OTP before submitting.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const res = await axiosInstance.post("/api/employees/register", formData);
      if (res.data.success) {
        alert("Employee added successfully.");
        setForm({
          name: "",
          phone: "",
          otp: "",
          dob: "",
          aadhaar: null,
          personImage: null,
        });
        setAadhaarPreview(null);
        setPersonPreview(null);
        setOtpSent(false);
        setOtpVerified(false);
      } else {
        alert("Error saving employee.");
      }
    } catch (err) {
      console.error("Error saving employee:", err);
      alert("Failed to save employee.");
    }
  };

  return (
    <div className="add-employee-wrapper">
      <h2 className="add-employee-title">Add Employee (MazdoorMitr)</h2>
      <form className="add-employee-form" onSubmit={handleSubmit}>
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
          <button
            type="button"
            className="add-employee-otp-btn"
            onClick={sendOtp}
          >
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
              className="add-employee-verify-btn"
              onClick={verifyOtp}
            >
              Verify OTP
            </button>
          </>
        )}

        <label>
          Date of Birth:
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Aadhaar Image:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "aadhaar")}
            required
          />
          {aadhaarPreview && (
            <div className="add-employee-image-preview">
              <img src={aadhaarPreview} alt="Aadhaar Preview" />
            </div>
          )}
        </label>

        <label>
          Person Image:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "personImage")}
            required
          />
          {personPreview && (
            <div className="add-employee-image-preview">
              <img src={personPreview} alt="Person Preview" />
            </div>
          )}
        </label>

        <button type="submit" className="add-employee-submit-btn">
          Register Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployeePage;
