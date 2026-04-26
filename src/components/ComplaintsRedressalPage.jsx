import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import "./ComplaintsRedressalPage.css";

const ComplaintsRedressalPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filters, setFilters] = useState({
    userId: "",
    date: "",
  });
  const [reply, setReply] = useState("");

  const fetchComplaints = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/api/users/protected/admin/complaints",
        { params: filters }
      );
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSearch = () => {
    fetchComplaints();
  };

  const formatDate = (millis) =>
    millis ? new Date(millis).toLocaleString() : "";

  const formatTime = (millis) =>
    millis ? new Date(millis).toLocaleTimeString() : "";

  // ✅ ADMIN REPLY
  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    try {
      const { data } = await axiosInstance.post(
        `/api/users/protected/admin/complaints/${selectedComplaint.id}/reply`,
        { message: reply }
      );

      setReply("");

      if (data.updatedComplaint) {
        setSelectedComplaint(data.updatedComplaint);
        setComplaints((prev) =>
          prev.map((c) =>
            c.id === data.updatedComplaint.id
              ? data.updatedComplaint
              : c
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 DETAIL VIEW
  if (selectedComplaint) {
    const comments = selectedComplaint.comments || [];

    return (
      <div className="complaints-redressal-mechanism-wrapper">
        <div className="complaints-redressal-mechanism-header">
          <button
            onClick={() => setSelectedComplaint(null)}
            className="complaints-redressal-mechanism-back-btn"
          >
            ← Back
          </button>
        </div>

        <div className="complaints-redressal-mechanism-main-card">
          <div className="complaints-redressal-mechanism-ticket-info">
            <h3>{selectedComplaint.title}</h3>
            <span className="complaints-redressal-mechanism-status">
              {selectedComplaint.status}
            </span>
          </div>

          <p>{selectedComplaint.description}</p>
          <small>
            User: {selectedComplaint.userId}
            <br />
            Created: {formatDate(selectedComplaint.createdAtMillis)}
          </small>
        </div>

        {/* CHAT */}
        <div className="complaints-redressal-mechanism-chat">
          {comments.map((c, i) => (
            <div
              key={i}
              className={`complaints-redressal-mechanism-bubble ${
                c.senderType === "admin"
                  ? "admin"
                  : "user"
              }`}
            >
              {c.message}
              <span>{formatTime(c.createdAtMillis)}</span>
            </div>
          ))}
        </div>

        {/* INPUT */}
        {selectedComplaint.status !== "RESOLVED" && (
          <form
            className="complaints-redressal-mechanism-input"
            onSubmit={handleReply}
          >
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Reply to user..."
            />
            <button type="submit">Send</button>
          </form>
        )}
      </div>
    );
  }

  // 🔹 LIST VIEW
  return (
    <div className="complaints-redressal-mechanism-wrapper">
      <h2>Complaints Redressal</h2>

      {/* FILTERS */}
      <div className="complaints-redressal-mechanism-filters">
        <input
          type="text"
          placeholder="User ID"
          value={filters.userId}
          onChange={(e) =>
            setFilters({ ...filters, userId: e.target.value })
          }
        />

        <input
          type="date"
          value={filters.date}
          onChange={(e) =>
            setFilters({ ...filters, date: e.target.value })
          }
        />

        <button onClick={handleSearch}>Search</button>
      </div>

      {/* LIST */}
      <div className="complaints-redressal-mechanism-list">
        {complaints.map((c) => (
          <div
            key={c.id}
            className="complaints-redressal-mechanism-card"
            onClick={() => setSelectedComplaint(c)}
          >
            <div className="row">
              <b>{c.title}</b>
              <span>{c.status}</span>
            </div>

            <p>{c.description}</p>

            <small>
              User: {c.userId} <br />
              {formatDate(c.createdAtMillis)}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintsRedressalPage;