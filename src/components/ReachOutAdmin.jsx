import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import "./ReachOutAdmin.css";

const ReachOutAdmin = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const params = {};
      if (statusFilter !== "ALL") params.status = statusFilter;

      const { data } = await axiosInstance.get(
        "/api/users/protected/reach-out-messages",
        { params }
      );

      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.post("/api/users/protected/update-reachout-status", {
        id,
        status,
      });

      fetchMessages();
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="reachout-container">
      <h2 className="reachout-title">Reach Out Messages</h2>

      {/* Filter */}
      <div className="reachout-filters">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="NEW">New</option>
          <option value="RESOLVED">Resolved</option>
          <option value="IGNORED">Ignored</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}

      <div className="reachout-list">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="reachout-card"
            onClick={() => setSelected(msg)}
          >
            <div><b>{msg.name}</b></div>
            <div>{msg.contact}</div>
            <div className="reachout-status">{msg.status}</div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div className="reachout-modal">
          <div className="reachout-modal-content">
            <h3>Message Details</h3>

            <p><b>Name:</b> {selected.name}</p>
            <p><b>Contact:</b> {selected.contact}</p>
            <p><b>Status:</b> {selected.status}</p>
            <p><b>Message:</b></p>
            <p className="reachout-message-box">{selected.message}</p>

            <div className="reachout-actions">
              <button onClick={() => updateStatus(selected.id, "RESOLVED")}>
                Mark Resolved
              </button>
              <button onClick={() => updateStatus(selected.id, "IGNORED")}>
                Ignore
              </button>
            </div>

            <button
              className="reachout-close"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReachOutAdmin;