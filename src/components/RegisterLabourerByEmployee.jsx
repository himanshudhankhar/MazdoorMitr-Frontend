import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import "./RegisterLabourerByEmployee.css";

const hinglishTaglines = [
    "Main expert hoon plumbing mein",
    "Mere haathon mein hunar hai painting ka",
    "Sab kaam perfect karta hoon masonry ka",
    "Electrician ka king hoon main",
    "Main hoon sabse tez painter",
    "Mazbooti se karta hoon construction ka kaam",
    "Lakdi ka boss, banaye har saaman ko dost!",
    "Kaath pe hathoda, sapne banaye toda-toda!",
    "Furniture ka jadoo, humse seekhe har naya mood!",
    "Current ka khel, humse seekhe har ek cell!",
    "Bijli ka jhatka, hum dete hain perfect latka!",
    "Wire mein jaan, hum banaye ghar ka samaan!",
    "Pipe ka raja, har leak ko kare saja!",
    "Pani ka flow, humse na koi ro-ro!",
    "Nalka ho ya tanki, hum hain asli masti ki khanki!",
    "Deewar ka ustaad, banaye ghar bemisaal!",
    "Eent aur cement, hum dete hain solid intent!",
    "Chhath ho ya makaan, humse banta hai pura samaan!",
    "Rang ka jadoogar, deewar banaye superstar!",
    "Brush mein hai dum, har ghar ko banaye hum yum!",
    "Colour ka blast, humse mile mast-mast!",
    "Hammer ka hero, banaye ghar ko zero se nero!",
    "Loha ya lakdi, humse sab hai sakdi!",
    "Kaam ka swag, humse seekhe har ek jag!",
    "Bijli ka funda, humse na koi chhupa chhunda!",
    "Switch ka style, hum banaye ghar ko smile!",
    "Watt ka power, humse chalta har ek tower!",
    "Tap se tapak, hum band karein ek jhatak!",
    "Pani ka pressure, humse mile perfect measure!",
    "Pipeline ka plan, hum hain asli super man!",
    "Cement ka josh, humse banta ghar ka hosh!",
    "Eent pe eent, hum dete hain perfect scent!",
    "Pillar ka power, humse chalta har ek floor!",
    "Rangon ka mela, humse ghar ka khel khela!",
    "Deewar ka fashion, humse mile colour ka passion!",
    "Paint ka hungama, humse ghar ka naya drama!",
    "Kaam mein speed, humse mile har ek need!",
    "Tools ka tashan, humse ghar ka pura fashion!",
    "Lakdi ka logic, humse banaye magic!",
    "Current ka craze, humse ghar mein light ka phase!",
    "Wire ka wonder, humse na koi blunder!",
    "Pani ka boss, humse na koi loss!",
    "Leak ka dushman, hum hain asli superhuman!",
    "Tank ka tanker, humse chalta pani ka anchor!",
    "Deewar ka dhamaal, humse ghar ka kamaal!",
    "Cement ka charm, humse ghar ka perfect arm!",
    "Makaan ka master, humse chalta har ek plaster!",
    "Rang ka rocket, humse ghar ka naya socket!",
    "Brush ka badshah, humse ghar ka naya shah!",
    "Colour ka khel, humse ghar ka har ek cell!",
    "Kaam ka king, humse chalta har ek wing!",
    "Tools ka tufaan, humse ghar ka pura imaan!",
    "Lakdi ka leader, humse ghar ka har ek feeder!",
    "Bijli ka baap, humse chalta har ek tap!",
    "Pipe ka prince, humse ghar ka har ek rinse!",
    "Deewar ka don, humse ghar ka har ek tone!",
];

const RegisterLabourerByEmployee = () => {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        otp: "",
        location: "",
        skills: "",
        tagline: hinglishTaglines[0],
        callTimeFrom: "",
        callTimeTo: "",
        image: null,
    });

    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const employeeId = localStorage.getItem("userId");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setForm((prev) => ({ ...prev, image: file }));
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const sendOtp = async () => {
        if (!form.name) return alert("Name is required");
        if (!form.phone) return alert("Phone number is required");

        try {
            await axiosInstance.post("/api/users/protected/labourer/send-otp", {
                name: form.name,
                phone: form.phone,
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
        if (!form.otp) return alert("Enter OTP first");

        try {
            const res = await axiosInstance.post("/api/users/protected/labourer/verify-otp", {
                name: form.name,
                phone: form.phone,
                otp: form.otp,
            });
            if (res.data.success) {
                setOtpVerified(true);
                alert("OTP verified successfully!");
            } else {
                alert("OTP verification failed.");
            }
        } catch (err) {
            console.error("OTP verification failed:", err);
            alert("OTP verification failed.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otpVerified) {
            return alert("Please verify OTP before registering.");
        }

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });
            formData.append("employeeId", employeeId);

            const res = await axiosInstance.post(
                "/api/users/protected/labourer/register-by-employee",
                formData
            );

            if (res.data.success) {
                alert("Labourer registered successfully!");
                setForm({
                    name: "",
                    phone: "",
                    otp: "",
                    location: "",
                    skills: "",
                    tagline: hinglishTaglines[0],
                    callTimeFrom: "",
                    callTimeTo: "",
                    image: null,
                });
                setImagePreview(null);
                setOtpSent(false);
                setOtpVerified(false);
            } else {
                alert("Registration failed.");
            }
        } catch (err) {
            console.error("Error registering labourer:", err);
            alert("Error registering labourer.");
        }
    };

    return (
        <div className="register-labourer-employee-wrapper">
            <header className="register-labourer-employee-header">
                <h1>MazdoorMitr - Employee Portal</h1>
            </header>

            <main className="register-labourer-employee-container">
                <h2 className="register-labourer-employee-title">Register Labourer</h2>
                <form className="register-labourer-employee-form" onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input type="text" name="name" value={form.name} onChange={handleChange} required />
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
                        <button type="button" onClick={sendOtp} className="register-labourer-employee-otp-btn">
                            Send OTP
                        </button>
                    </label>

                    {otpSent && (
                        <>
                            <label>
                                Enter OTP:
                                <input type="text" name="otp" value={form.otp} onChange={handleChange} required />
                            </label>
                            <button
                                type="button"
                                onClick={verifyOtp}
                                className="register-labourer-employee-verify-btn"
                            >
                                Verify OTP
                            </button>
                        </>
                    )}

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
                        Skills:
                        <input
                            type="text"
                            name="skills"
                            value={form.skills}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Tagline:
                        <select name="tagline" value={form.tagline} onChange={handleChange}>
                            {hinglishTaglines.map((line, i) => (
                                <option key={i} value={line}>
                                    {line}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="register-labourer-employee-time-fields">
                        <label>
                            Call Time From:
                            <input
                                type="time"
                                name="callTimeFrom"
                                value={form.callTimeFrom}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            Call Time To:
                            <input
                                type="time"
                                name="callTimeTo"
                                value={form.callTimeTo}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <label>
                        Upload Profile Image:
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                    </label>

                    {imagePreview && (
                        <div className="register-labourer-employee-image-preview">
                            <img src={imagePreview} alt="Preview" />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="register-labourer-employee-submit-btn"
                        disabled={!otpVerified}
                    >
                        Register Labourer
                    </button>
                </form>
            </main>

            <footer className="register-labourer-employee-footer">
                <p>&copy; 2025 MazdoorMitr Platform. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default RegisterLabourerByEmployee;
