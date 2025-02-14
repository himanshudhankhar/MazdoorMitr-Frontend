import React, { useState, useEffect } from "react";
import "./AllMediationRequests.css"; // Import CSS

const AllMediationRequests = () => {
    const [mediationRequests, setMediationRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);

    useEffect(() => {
        const sampleData = [
            { id: "MR101", employerId: "E001", employerName: "Rajesh Verma", labourerId: "L101", labourerName: "Amit Kumar", requestDate: "2025-02-01 10:00:00", employeeName: "Suresh Gupta", status: "Done", closedDate: "2025-02-01 12:00:00" },
            { id: "MR102", employerId: "E002", employerName: "Priya Singh", labourerId: "L102", labourerName: "Rahul Sharma", requestDate: "2025-01-30 15:30:00", employeeName: "Neha Sharma", status: "Pending", closedDate: null },
            { id: "MR103", employerId: "E003", employerName: "Ankit Malhotra", labourerId: "L103", labourerName: "Deepak Yadav", requestDate: "2025-01-29 14:00:00", employeeName: "Rohit Kumar", status: "Done", closedDate: "2025-01-29 16:45:00" },
        ];

        setMediationRequests(sampleData);
        setFilteredRequests(sampleData);
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = mediationRequests.filter((r) =>
            r.employerName.toLowerCase().includes(query) ||
            r.employerId.toLowerCase().includes(query) ||
            r.labourerName.toLowerCase().includes(query) ||
            r.labourerId.toLowerCase().includes(query) ||
            r.employeeName.toLowerCase().includes(query) ||
            (r.requestDate && r.requestDate.includes(query)) ||
            (r.closedDate && r.closedDate.includes(query)) ||
            r.id.includes(query)
        );
        setFilteredRequests(filtered);
    };

    return (
        <div className="admin-mediation-container">
            <h2 className="admin-mediation-title">All Mediation Requests</h2>

            <input
                type="text"
                placeholder="Search by employer, labourer, employee, date, or request ID..."
                onChange={handleSearch}
                className="admin-mediation-search-input"
            />

            <div className="admin-mediation-table-container">
                <table className="admin-mediation-table">
                    <thead>
                        <tr>
                            <th>Mediation ID</th>
                            <th>Employer (ID & Name)</th>
                            <th>Labourer (ID & Name)</th>
                            <th>Request Date & Time</th>
                            <th>Handled By (Employee Name)</th>
                            <th>Status</th>
                            <th>Closed Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests
                            .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate))
                            .map((r) => (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{r.employerId} - {r.employerName}</td>
                                    <td>{r.labourerId} - {r.labourerName}</td>
                                    <td>{r.requestDate}</td>
                                    <td>{r.employeeName}</td>
                                    <td className={r.status === "Done" ? "admin-mediation-done" : "admin-mediation-pending"}>{r.status}</td>
                                    <td>{r.closedDate || "Pending"}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllMediationRequests;
