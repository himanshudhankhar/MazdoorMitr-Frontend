import React, { useState, useEffect } from "react";
import "./PremiumPage.css";
import axiosInstance from "../axiosConfig";

const YOUR_RAZORPAY_KEY_ID = "rzp_live_RoNYuHnX9kJVm7";

const PremiumPage = () => {
    const [form, setForm] = useState({
        workType: "",
        location: "",
        startDate: "",
        hiringType: "quick",
        workerCount: "",
        description: "",
        wageMin: "",
        wageMax: ""
    });

    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleHiringTypeChange = (type) => {
        setForm((prev) => ({ ...prev, hiringType: type }));
    };

    const handleSuggestedWage = () => {
        setForm((prev) => ({ ...prev, wageMin: 500, wageMax: 700 }));
    };

    // 🔥 Fetch user's premium requests
    const fetchPremiumRequests = async () => {
        try {
            const res = await axiosInstance.get("/api/users/protected/premium-requests");
            if (res.data?.success) {
                setRequests(res.data.requests || []);
            }
        } catch (err) {
            console.error("Fetch requests error:", err);
        }
    };

    useEffect(() => {
        fetchPremiumRequests();
    }, []);

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.workType || !form.location || !form.startDate) {
        alert("Please fill all required fields");
        return;
    }

    if (form.hiringType === "quick" && !form.workerCount) {
        alert("Please enter number of workers");
        return;
    }

    if (!form.wageMin || !form.wageMax) {
        alert("Please enter wage range");
        return;
    }

    try {
        setLoading(true);

        // ✅ Directly create premium request using wallet balance
        const res = await axiosInstance.post(
            "/api/users/protected/premium-request",
            {
                ...form
            }
        );

        if (res.data?.success) {
            alert("₹100 deducted from wallet. Premium request created successfully.");

            // ✅ Reset form
            setForm({
                workType: "",
                location: "",
                startDate: "",
                hiringType: "quick",
                workerCount: "",
                description: "",
                wageMin: "",
                wageMax: ""
            });

            // ✅ Refresh requests
            fetchPremiumRequests();
        } else {
            alert(res.data?.message || "Unable to create premium request.");
        }

    } catch (error) {
        console.error(error);

        alert(
            error?.response?.data?.message ||
            "Something went wrong."
        );
    } finally {
        setLoading(false);
    }
};
    return (
        <div className="premium-page-container">
            <div className="premium-page-card">
                <h2 className="premium-page-title">Hire Trusted Workers</h2>

                <p className="premium-page-subtitle">
                    Get verified, available workers quickly with our assisted hiring service
                </p>

                {/* Token Info */}
                <div className="premium-page-token-box">
                    <p>
                        <strong>₹100 to start as Token Fee</strong> (refundable / adjusted later)
                    </p>
                    <p className="premium-page-token-subtext">
                        We will call and confirm workers for your requirement.
                    </p>
                    <p className="premium-page-token-subtext">
                        After that, you pay <strong>₹50 per confirmed worker</strong> to get contact details.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="premium-page-field">
                        <label>Type of Work</label>
                        <textarea
                            name="workType"
                            value={form.workType}
                            onChange={handleChange}
                            className="premium-page-textarea"
                        />
                    </div>

                    <div className="premium-page-field">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            className="premium-page-input"
                        />
                    </div>

                    <div className="premium-page-field">
                        <label>Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                            className="premium-page-input"
                        />
                    </div>

                    <div className="premium-page-field">
                        <label>How would you like to hire?</label>

                        <div className="premium-page-option-group">
                            <div
                                className={`premium-page-option ${form.hiringType === "quick" ? "active" : ""}`}
                                onClick={() => handleHiringTypeChange("quick")}
                            >
                                <input type="radio" checked readOnly />
                                <span>
                                    <strong>Quick Hire</strong>
                                </span>
                            </div>

                            <div
                                className={`premium-page-option ${form.hiringType === "suggest" ? "active" : ""}`}
                                onClick={() => handleHiringTypeChange("suggest")}
                            >
                                <input type="radio" checked={form.hiringType === "suggest"} readOnly />
                                <span>
                                    <strong>Need Help Hiring</strong>
                                </span>
                            </div>
                        </div>
                    </div>

                    {form.hiringType === "quick" && (
                        <div className="premium-page-field">
                            <label>Number of Workers</label>
                            <input
                                type="number"
                                name="workerCount"
                                value={form.workerCount}
                                onChange={handleChange}
                                className="premium-page-input"
                            />
                        </div>
                    )}

                    {form.hiringType === "suggest" && (
                        <div className="premium-page-field">
                            <label>Project Details</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="premium-page-textarea"
                            />
                        </div>
                    )}

                    <div className="premium-page-field">
                        <label>Wage Range (per day)</label>

                        <div className="premium-page-wage-row">
                            <input
                                type="number"
                                name="wageMin"
                                value={form.wageMin}
                                onChange={handleChange}
                                className="premium-page-input"
                            />
                            <input
                                type="number"
                                name="wageMax"
                                value={form.wageMax}
                                onChange={handleChange}
                                className="premium-page-input"
                            />
                        </div>

                        <button
                            type="button"
                            className="premium-page-suggest-btn"
                            onClick={handleSuggestedWage}
                        >
                            Use Recommended Range
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="premium-page-submit-btn"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Proceed & Pay ₹100"}
                    </button>
                </form>

                {/* 🔥 Requests List */}
                <div className="premium-requests-container">
                    <h3 className="premium-requests-title">Your Premium Requests</h3>

                    {requests.length === 0 ? (
                        <p className="premium-requests-empty">No requests yet</p>
                    ) : (
                        <div className="premium-requests-list">
                            {requests.map((req) => (
                                <div key={req.requestId} className="premium-requests-card">
                                    <div className="premium-requests-row">
                                        <span className="premium-requests-label">Work:</span>
                                        <span>{req.workType}</span>
                                    </div>

                                    <div className="premium-requests-row">
                                        <span className="premium-requests-label">Location:</span>
                                        <span>{req.location}</span>
                                    </div>

                                    <div className="premium-requests-row">
                                        <span className="premium-requests-label">Wage:</span>
                                        <span>₹{req.wageMin} - ₹{req.wageMax}</span>
                                    </div>

                                    <div className="premium-requests-row">
                                        <span className="premium-requests-label">Status:</span>
                                        <span className={`premium-requests-status ${req.status}`}>
                                            {req.status}
                                        </span>
                                    </div>

                                    <div className="premium-requests-row">
                                        <span className="premium-requests-label">Date:</span>
                                        <span>
                                            {new Date(req.createdAt).toLocaleString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PremiumPage;