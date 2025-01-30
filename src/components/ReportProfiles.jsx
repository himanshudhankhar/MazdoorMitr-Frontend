import React, { useState } from "react";
import "./ReportProfiles.css";

const dummyReports = [
  {
    id: 1,
    reporter: { id: 101, name: "Amit Sharma" },
    reported: { id: 201, name: "Ramesh Kumar" },
    reason: "Fraudulent job offers",
  },
  {
    id: 2,
    reporter: { id: 102, name: "Sunita Verma" },
    reported: { id: 202, name: "Suresh Singh" },
    reason: "Abusive language in chat",
  },
  {
    id: 3,
    reporter: { id: 103, name: "Manoj Yadav" },
    reported: { id: 203, name: "Amit Sharma" },
    reason: "Misleading profile details",
  },
];

const ReportProfiles = () => {
  const [reports, setReports] = useState(dummyReports);

  const handleEscalate = (id) => {
    alert(`Report ID ${id} escalated to Admin.`);
    setReports(reports.filter((report) => report.id !== id));
  };

  const handleReject = (id) => {
    alert(`Report ID ${id} rejected.`);
    setReports(reports.filter((report) => report.id !== id));
  };

  return (
    <div className="report-profiles-container">
      <header className="report-profiles-header">
        <h1>Reported Profiles</h1>
      </header>

      {reports.length === 0 ? (
        <p className="report-profiles-no-reports">No reports available.</p>
      ) : (
        <div className="report-profiles-list">
          {reports.map((report) => (
            <div key={report.id} className="report-profiles-card">
              <h3>Report ID: {report.id}</h3>
              <p><strong>Reporter:</strong> {report.reporter.name} (ID: {report.reporter.id})</p>
              <p><strong>Reported Profile:</strong> {report.reported.name} (ID: {report.reported.id})</p>
              <p><strong>Reason:</strong> {report.reason}</p>
              <div className="report-profiles-actions">
                <button onClick={() => handleEscalate(report.id)} className="report-profiles-escalate-btn">Escalate to Admin</button>
                <button onClick={() => handleReject(report.id)} className="report-profiles-reject-btn">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer className="report-profiles-footer">
        <p>&copy; 2025 MazdoorMitr. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default ReportProfiles;
