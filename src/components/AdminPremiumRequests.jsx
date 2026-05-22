import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../axiosConfig";
import "./AdminPremiumRequests.css";

const statusOptions = [
  { label: "All Statuses", value: "ALL" },
  { label: "Token Paid", value: "TOKEN_PAID" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Rejected", value: "REJECTED" },
];

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = typeof value === "number" ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString();
};

const formatStatus = (status) => {
  if (!status) return "-";
  return status.replace(/^REQUEST_/, "").replace(/_/g, " ");
};

const getStatusClass = (status) => {
  if (status === "REQUEST_COMPLETED") return "AdminPremiumRequests-statusCompleted";
  if (status === "REQUEST_REJECTED") return "AdminPremiumRequests-statusRejected";
  if (status === "TOKEN_PAID") return "AdminPremiumRequests-statusPending";
  return "AdminPremiumRequests-statusNeutral";
};

const AdminPremiumRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusAction, setStatusAction] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const [filters, setFilters] = useState({
    date: "",
    fromDate: "",
    toDate: "",
    status: "ALL",
  });

  const totalTokenAmount = useMemo(
    () => requests.reduce((sum, item) => sum + Number(item.tokenAmount || 0), 0),
    [requests]
  );

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const params = {};
      if (filters.date) {
        params.date = filters.date;
      } else {
        if (filters.fromDate) params.fromDate = filters.fromDate;
        if (filters.toDate) params.toDate = filters.toDate;
      }
      if (filters.status && filters.status !== "ALL") params.status = filters.status;

      const { data } = await axiosInstance.get(
        "/api/users/protected/admin/premium-requests",
        { params }
      );

      setRequests(data.requests || []);
    } catch (err) {
      console.error("Failed to fetch premium requests:", err);
      setError(err.response?.data?.message || "Failed to load premium requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateFilter = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      ...(key === "date" && value ? { fromDate: "", toDate: "" } : {}),
      ...((key === "fromDate" || key === "toDate") && value ? { date: "" } : {}),
    }));
  };

  const openStatusModal = (request, action) => {
    setSelectedRequest(request);
    setStatusAction(action);
    setRejectionReason("");
    setError("");
    setSuccessMessage("");
  };

  const closeStatusModal = () => {
    setSelectedRequest(null);
    setStatusAction("");
    setRejectionReason("");
  };

  const submitStatusUpdate = async () => {
    if (!selectedRequest || !statusAction) return;

    if (statusAction === "REJECTED" && !rejectionReason.trim()) {
      setError("Please enter a rejection reason.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axiosInstance.post(
        `/api/users/protected/admin/premium-requests/${selectedRequest.requestId}/status`,
        {
          status: statusAction,
          rejectionReason: rejectionReason.trim(),
        }
      );

      setSuccessMessage("Premium request status updated successfully.");
      closeStatusModal();
      await fetchRequests();
    } catch (err) {
      console.error("Failed to update premium request status:", err);
      setError(err.response?.data?.message || "Failed to update request status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="AdminPremiumRequests-page">
      <header className="AdminPremiumRequests-header">
        <div>
          <h1>Premium Service Requests</h1>
          <p>Review token-paid premium service requests and mark them completed or rejected.</p>
        </div>
        <button type="button" onClick={fetchRequests} disabled={loading}>
          Refresh
        </button>
      </header>

      <section className="AdminPremiumRequests-summary">
        <div>
          <span>Total Requests</span>
          <strong>{requests.length}</strong>
        </div>
        <div>
          <span>Token Amount</span>
          <strong>Rs {totalTokenAmount}</strong>
        </div>
        <div>
          <span>Pending</span>
          <strong>{requests.filter((item) => item.status === "TOKEN_PAID").length}</strong>
        </div>
      </section>

      <section className="AdminPremiumRequests-filters">
        <label>
          Single Date
          <input
            type="date"
            value={filters.date}
            onChange={(event) => updateFilter("date", event.target.value)}
          />
        </label>
        <label>
          From Date
          <input
            type="date"
            value={filters.fromDate}
            onChange={(event) => updateFilter("fromDate", event.target.value)}
          />
        </label>
        <label>
          To Date
          <input
            type="date"
            value={filters.toDate}
            onChange={(event) => updateFilter("toDate", event.target.value)}
          />
        </label>
        <label>
          Status
          <select
            value={filters.status}
            onChange={(event) => updateFilter("status", event.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={fetchRequests} disabled={loading}>
          Search
        </button>
      </section>

      {error && <p className="AdminPremiumRequests-error">{error}</p>}
      {successMessage && <p className="AdminPremiumRequests-success">{successMessage}</p>}
      {loading && <p className="AdminPremiumRequests-state">Loading premium requests...</p>}

      {!loading && requests.length === 0 && (
        <p className="AdminPremiumRequests-state">No premium requests found.</p>
      )}

      <section className="AdminPremiumRequests-list">
        {requests.map((request) => (
          <article className="AdminPremiumRequests-card" key={request.requestId}>
            {(() => {
              const isFinalStatus = ["REQUEST_COMPLETED", "REQUEST_REJECTED"].includes(request.status);

              return (
                <>
            <div className="AdminPremiumRequests-cardHeader">
              <div>
                <h2>{request.workType || "Premium Request"}</h2>
                <p>{request.userName || "Unknown user"} · {request.userPhone || "-"}</p>
              </div>
              <span className={`AdminPremiumRequests-status ${getStatusClass(request.status)}`}>
                {formatStatus(request.status)}
              </span>
            </div>

            <div className="AdminPremiumRequests-grid">
              <p><span>Location</span>{request.location || "-"}</p>
              <p><span>Start Date</span>{request.startDate || "-"}</p>
              <p><span>Hiring Type</span>{request.hiringType || "-"}</p>
              <p><span>Workers</span>{request.workerCount || "-"}</p>
              <p><span>Wage Range</span>Rs {request.wageMin || "-"} - Rs {request.wageMax || "-"}</p>
              <p><span>Token</span>Rs {request.tokenAmount || 0}</p>
              <p><span>Payment</span>{request.paymentStatus || "-"} via {request.paymentMethod || "-"}</p>
              <p><span>Created</span>{formatDateTime(request.createdAtMillis || request.createdAt)}</p>
            </div>

            {request.description && (
              <p className="AdminPremiumRequests-description">{request.description}</p>
            )}

            {request.rejectionReason && (
              <p className="AdminPremiumRequests-rejection">
                <span>Rejection reason:</span> {request.rejectionReason}
              </p>
            )}

            <div className="AdminPremiumRequests-actions">
              <button
                type="button"
                onClick={() => openStatusModal(request, "COMPLETED")}
                disabled={isFinalStatus}
              >
                Mark Completed
              </button>
              <button
                type="button"
                className="AdminPremiumRequests-rejectButton"
                onClick={() => openStatusModal(request, "REJECTED")}
                disabled={isFinalStatus}
              >
                Reject
              </button>
            </div>
                </>
              );
            })()}
          </article>
        ))}
      </section>

      {selectedRequest && (
        <div className="AdminPremiumRequests-modal">
          <div className="AdminPremiumRequests-modalContent">
            <h3>
              {statusAction === "COMPLETED" ? "Mark Request Completed" : "Reject Premium Request"}
            </h3>
            <p>
              {selectedRequest.workType || "Premium request"} for {selectedRequest.userName || "user"}
            </p>

            {statusAction === "REJECTED" && (
              <label>
                Rejection Reason
                <textarea
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                  rows="4"
                  placeholder="Write why this request is rejected"
                />
              </label>
            )}

            <div className="AdminPremiumRequests-modalActions">
              <button type="button" onClick={submitStatusUpdate} disabled={loading}>
                Confirm
              </button>
              <button type="button" onClick={closeStatusModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPremiumRequests;
