import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import "./AddLabourer.css";

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

const AddLabourerPage = () => {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        otp: "",
        location: "",
        skills: "",
        tagline: hinglishTaglines[0],
        image: null,
        callTimeStart: "",
        callTimeEnd: "",
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
        if (!form.name.trim()) {
            alert("Name is required.");
            return;
        }

        try {
            await axiosInstance.post("/api/users/protected/simple-send-otp", {
                name: form.name.trim(),
                phone: form.phone,
                workerType: "Labourer"
            });
            setOtpSent(true);
            setOtpVerified(false);
            setForm((prev) => ({ ...prev, otp: '' }));
            alert("OTP sent successfully.");
        } catch (err) {
            console.error("Failed to send OTP:", err);
            alert("Failed to send OTP.");
        }
    };


    const verifyOtp = async () => {
        try {
            const res = await axiosInstance.post("/api/users/protected/simple-verify-otp", {
                name: form.name.trim(),
                phone: form.phone,
                otp: form.otp,
            });

            if (res.data.success) {
                alert("OTP verified!");
                setOtpVerified(true);
            } else {
                alert("OTP verification failed.");
            }
        } catch (err) {
            console.error("OTP verification error:", err);
            alert("Error verifying OTP.");
        }
    };

    const registerLabourer = async (e) => {
        e.preventDefault();

        if (!otpVerified) {
            alert("Please verify OTP before registering.");
            return;
        }

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });

            const res = await axiosInstance.post("/api/users/protected/register-labourer", formData);

            if (res.data.success) {
                alert("Labourer registered successfully!");
                setForm({
                    name: "",
                    phone: "",
                    otp: "",
                    location: "",
                    skills: "",
                    tagline: hinglishTaglines[0],
                    image: null,
                    callTimeStart: "",
                    callTimeEnd: "",
                });
                setImagePreview(null);
                setOtpSent(false);
                setOtpVerified(false);
            } else {
                alert("Registration failed.");
            }
        } catch (err) {
            console.error("Failed to register labourer:", err);
            alert("Error during registration.");
        }
    };

    return (
        <div className="add-labourer-wrapper">
            <header className="add-labourer-header">
                <h1 style={{ color: "white" }}>MazdoorMitr Admin</h1>
            </header>

            <main className="add-labourer-container">
                <h2 className="add-labourer-title">Add Labourer</h2>
                <form className="add-labourer-form" onSubmit={registerLabourer}>
                    <label>
                        Name:
                        <input type="text" name="name" value={form.name} onChange={handleChange} required />
                    </label>

                    <label>
                        Mobile Number:
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
                        <button type="button" onClick={sendOtp} className="add-labourer-otp-btn">
                            {otpSent ? "Resend OTP" : "Send OTP"}
                        </button>
                    </label>

                    {otpSent && !otpVerified && (
                        <>
                            <label>
                                Enter OTP:
                                <input type="text" name="otp" value={form.otp} onChange={handleChange} required />
                            </label>
                            <button type="button" className="add-labourer-otp-btn" onClick={verifyOtp}>
                                Verify OTP
                            </button>
                        </>
                    )}

                    <label>
                        Location:
                        <input type="text" name="location" value={form.location} onChange={handleChange} required />
                    </label>

                    <label>
                        Skills:
                        <input type="text" name="skills" value={form.skills} onChange={handleChange} required />
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

                    <label>
                        Preferable Call Timing:
                        <div className="add-labourer-calltime">
                            <input
                                type="time"
                                name="callTimeStart"
                                value={form.callTimeStart}
                                onChange={handleChange}
                                required
                            />
                            to
                            <input
                                type="time"
                                name="callTimeEnd"
                                value={form.callTimeEnd}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </label>

                    <label>
                        Upload Image:
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                    </label>

                    {imagePreview && (
                        <div className="add-labourer-image-preview">
                            <img src={imagePreview} alt="Preview" />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="add-labourer-submit-btn"
                        disabled={!otpVerified}
                    >
                        Register Labourer
                    </button>
                </form>
            </main>

            <footer className="add-labourer-footer">
                <p>&copy; 2025 MazdoorMitr Platform. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AddLabourerPage;