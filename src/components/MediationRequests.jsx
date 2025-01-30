import React, { useState } from "react";
import "./MediationRequests.css";

const dummyMediationRequests = [
  {
    id: 1,
    employer: { id: 101, name: "Rajesh Verma" },
    labourer: { id: 201, name: "Ramesh Kumar", mobile: "9876543210" },
    location: "Delhi",
    salary: "₹15,000/month",
    details: "Need a carpenter for a full-time position.",
  },
  {
    id: 2,
    employer: { id: 102, name: "Anita Sharma" },
    labourer: { id: 202, name: "Suresh Singh", mobile: "8765432109" },
    location: "Mumbai",
    salary: "₹12,000/month",
    details: "Looking for an electrician for a contract job.",
  },
  {
    id: 3,
    employer: { id: 103, name: "Vikram Yadav" },
    labourer: { id: 203, name: "Amit Sharma", mobile: "7654321098" },
    location: "Pune",
    salary: "₹18,000/month",
    details: "Need a plumber for a 6-month project.",
  },
];

const MediationRequests = () => {
  const [requests, setRequests] = useState(dummyMediationRequests);

  const handleConfirm = (id) => {
    alert(`Mediation request ID ${id} confirmed. Labourer contacted.`);
    setRequests(requests.filter((request) => request.id !== id));
  };

  const handleEscalate = (id) => {
    alert(`Mediation request ID ${id} escalated to Admin.`);
    setRequests(requests.filter((request) => request.id !== id));
  };

  const handleReject = (id) => {
    alert(`Mediation request ID ${id} rejected.`);
    setRequests(requests.filter((request) => request.id !== id));
  };

  return (
    <div className="mediation-requests-container">
      <header className="mediation-requests-header">
        <h1>Mediation Requests</h1>
      </header>

      {requests.length === 0 ? (
        <p className="mediation-requests-no-requests">No mediation requests available.</p>
      ) : (
        <div className="mediation-requests-list">
          {requests.map((request) => (
            <div key={request.id} className="mediation-requests-card">
              <h3>Request ID: {request.id}</h3>
              <p><strong>Employer:</strong> {request.employer.name} (ID: {request.employer.id})</p>
              <p><strong>Labourer:</strong> {request.labourer.name} (ID: {request.labourer.id})</p>
              <p><strong>Labourer Contact:</strong> {request.labourer.mobile}</p>
              <p><strong>Location:</strong> {request.location}</p>
              <p><strong>Offered Salary:</strong> {request.salary}</p>
              <p><strong>Details:</strong> {request.details}</p>
              <div className="mediation-requests-actions">
                <button onClick={() => handleConfirm(request.id)} className="mediation-requests-confirm-btn">Done</button>
                <button onClick={() => handleReject(request.id)} className="mediation-requests-reject-btn">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer className="mediation-requests-footer">
        <p>&copy; 2025 MazdoorMitr. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default MediationRequests;
