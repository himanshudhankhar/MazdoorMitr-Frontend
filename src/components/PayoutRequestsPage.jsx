// import React, { useEffect, useState } from "react";
// import axiosInstance from "../axiosConfig";
// import './PayoutRequestsPage.css';

// const PayoutRequests = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fetchRequests = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axiosInstance.get(
//         "/api/users/protected/payout-requests"
//       );

//       setRequests(data.requests || []);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load payout requests");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const getStatusClass = (status) => {
//     switch (status) {
//       case "PENDING":
//         return "PayoutRequests-statusPending";
//       case "COMPLETED":
//         return "PayoutRequests-statusCompleted";
//       case "REJECTED":
//         return "PayoutRequests-statusRejected";
//       default:
//         return "";
//     }
//   };

//   return (
//     <div className="PayoutRequests-container">
//       <h2 className="PayoutRequests-title">Payout Requests</h2>

//       {loading && <p className="PayoutRequests-loading">Loading...</p>}
//       {error && <p className="PayoutRequests-error">{error}</p>}

//       {!loading && requests.length === 0 && (
//         <p className="PayoutRequests-empty">
//           No payout requests found.
//         </p>
//       )}

//       <div className="PayoutRequests-list">
//         {requests.map((req) => (
//           <div key={req.requestId} className="PayoutRequests-card">

//             <div className="PayoutRequests-row">
//               <span className="PayoutRequests-label">Name:</span>
//               <span className="PayoutRequests-value">{req.userName}</span>
//             </div>
//             <div className="PayoutRequests-row">
//               <span className="PayoutRequests-label">Phone:</span>
//               <span className="PayoutRequests-value">{req.phone}</span>
//             </div>
//             <div className="PayoutRequests-row">
//               <span className="PayoutRequests-label">Amount:</span>
//               <span className="PayoutRequests-value">₹{req.amount}</span>
//             </div>

//             <div className="PayoutRequests-row">
//               <span className="PayoutRequests-label">UPI ID:</span>
//               <span className="PayoutRequests-value">{req.upiId}</span>
//             </div>

//             <div className="PayoutRequests-row">
//               <span className="PayoutRequests-label">Status:</span>
//               <span
//                 className={`PayoutRequests-status ${getStatusClass(
//                   req.status
//                 )}`}
//               >
//                 {req.status}
//               </span>
//             </div>

//             <div className="PayoutRequests-row">
//               <span className="PayoutRequests-label">Requested At:</span>
//               <span className="PayoutRequests-value">
//                 {req.createdAtMillis
//                   ? new Date(req.createdAtMillis).toLocaleString()
//                   : "-"}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PayoutRequests;

import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import "./PayoutRequestsPage.css";

const PayoutRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [filters, setFilters] = useState({
        name: "",
        phone: "",
        fromDate: "",
        toDate: "",
    });

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [utr, setUtr] = useState("");
    const [remark, setRemark] = useState("");

    // 🔍 Fetch with filters
    const fetchRequests = async () => {
        try {
            setLoading(true);

            const params = {};
            if (filters.name) params.userName = filters.name;
            if (filters.phone) params.phone = filters.phone;
            if (filters.fromDate) params.fromDate = new Date(filters.fromDate).getTime();
            if (filters.toDate) params.toDate = new Date(filters.toDate).getTime();

            const { data } = await axiosInstance.get(
                "/api/users/protected/payout-requests",
                { params }
            );

            setRequests(data.requests || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load payout requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleSearch = () => {
        fetchRequests();
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "PENDING":
                return "PayoutRequests-statusPending";
            case "COMPLETED":
                return "PayoutRequests-statusCompleted";
            case "REJECTED":
                return "PayoutRequests-statusRejected";
            default:
                return "";
        }
    };

    // ✅ Approve
    const handleApprove = async () => {
        if (!utr.trim()) {
            alert("Enter UTR number");
            return;
        }

        await axiosInstance.post("/api/users/protected/process-payout", {
            requestId: selectedRequest.requestId,
            action: "APPROVE",
            utr,
        });

        closeModal();
        fetchRequests();
    };

    // ❌ Reject
    const handleReject = async () => {
        if (!remark.trim()) {
            alert("Enter rejection remark");
            return;
        }

        await axiosInstance.post("/api/users/protected/process-payout", {
            requestId: selectedRequest.requestId,
            action: "REJECT",
            remark,
        });

        closeModal();
        fetchRequests();
    };

    const closeModal = () => {
        setSelectedRequest(null);
        setUtr("");
        setRemark("");
    };

    return (
        <div className="PayoutRequests-container">
            <h2 className="PayoutRequests-title">Payout Requests</h2>

            {/* 🔍 Filters */}
            <div className="PayoutRequests-filters">
                <input
                    placeholder="Search by Name"
                    value={filters.name}
                    onChange={(e) =>
                        setFilters({ ...filters, name: e.target.value })
                    }
                />
                <input
                    placeholder="Search by Phone"
                    value={filters.phone}
                    onChange={(e) =>
                        setFilters({ ...filters, phone: e.target.value })
                    }
                />
                <input
                    type="date"
                    onChange={(e) =>
                        setFilters({ ...filters, fromDate: e.target.value })
                    }
                />
                <input
                    type="date"
                    onChange={(e) =>
                        setFilters({ ...filters, toDate: e.target.value })
                    }
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {loading && <p className="PayoutRequests-loading">Loading...</p>}
            {error && <p className="PayoutRequests-error">{error}</p>}

            <div className="PayoutRequests-list">
                {requests.map((req) => (
                    <div
                        key={req.requestId}
                        className="PayoutRequests-card"
                        onClick={() => setSelectedRequest(req)}
                    >
                        <div className="PayoutRequests-row">
                            <span>Name:</span>
                            <span>{req.userName}</span>
                        </div>

                        <div className="PayoutRequests-row">
                            <span>Phone:</span>
                            <span>{req.phone}</span>
                        </div>

                        <div className="PayoutRequests-row">
                            <span>Amount:</span>
                            <span>₹{req.amount}</span>
                        </div>

                        <div className="PayoutRequests-row">
                            <span>Status:</span>
                            <span className={getStatusClass(req.status)}>
                                {req.status}
                            </span>
                        </div>


                        <div className="PayoutRequests-row">
                            <span className="PayoutRequests-label">UPI ID:</span>
                            <span className="PayoutRequests-value">{req.upiId}</span>
                        </div>

                        <div className="PayoutRequests-row">
                            <span className="PayoutRequests-label">Created At:</span>
                            <span className="PayoutRequests-value">
                                {req.createdAtMillis
                                    ? new Date(req.createdAtMillis).toLocaleString()
                                    : "-"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 🧾 Modal */}
            {selectedRequest && (
                <div className="PayoutRequests-modal">
                    <div className="PayoutRequests-modalContent">
                        <h3>Payout Details</h3>

                        <p><b>Name:</b> {selectedRequest.userName}</p>
                        <p><b>Phone:</b> {selectedRequest.phone}</p>
                        <p><b>Amount:</b> ₹{selectedRequest.amount}</p>
                        <p><b>UPI:</b> {selectedRequest.upiId}</p>
                        <p><b>CreatedAt:</b> {selectedRequest.createdAtMillis
                            ? new Date(selectedRequest.createdAtMillis).toLocaleString()
                            : "-"}</p>

                        {selectedRequest.status === "PENDING" && (
                            <>
                                <input
                                    placeholder="Enter UTR Number"
                                    value={utr}
                                    onChange={(e) => setUtr(e.target.value)}
                                />

                                <textarea
                                    placeholder="Enter rejection remark"
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                />

                                <div className="PayoutRequests-modalActions">
                                    <button onClick={handleApprove}>Approve</button>
                                    <button onClick={handleReject}>Reject</button>
                                </div>
                            </>
                        )}

                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PayoutRequests;