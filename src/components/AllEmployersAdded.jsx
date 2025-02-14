import React, { useState, useEffect } from "react";
import "./AllEmployersAdded.css"; // Import CSS file

const AllEmployersAdded = () => {
    const [employers, setEmployers] = useState([]);
    const [filteredEmployers, setFilteredEmployers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Sample data (Replace with API fetch in real implementation)
        const sampleData = [
            { id: "E101", name: "Rajesh Enterprises", contact: "9876543210", businessType: "Construction", location: "Delhi", addedBy: "Neha Sharma", dateAdded: "2025-02-01 10:30:00" },
            { id: "E102", name: "Sharma Builders", contact: "9123456789", businessType: "Real Estate", location: "Mumbai", addedBy: "Self", dateAdded: "2025-01-30 15:45:00" },
            { id: "E103", name: "Deepak Engineering", contact: "9865321478", businessType: "Manufacturing", location: "Bangalore", addedBy: "Anil Kumar", dateAdded: "2025-01-29 14:15:00" },
            { id: "E104", name: "Singh Constructions", contact: "9812345678", businessType: "Infrastructure", location: "Delhi", addedBy: "Self", dateAdded: "2025-01-28 12:20:00" },
        ];

        setEmployers(sampleData);
        setFilteredEmployers(sampleData);
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        filterEmployers(query);
    };

    const filterEmployers = (query) => {
        const filtered = employers.filter(e =>
            e.name.toLowerCase().includes(query) ||
            e.id.toLowerCase().includes(query) ||
            e.contact.includes(query) ||
            e.businessType.toLowerCase().includes(query) ||
            e.location.toLowerCase().includes(query) ||
            e.addedBy.toLowerCase().includes(query)
        );
        setFilteredEmployers(filtered);
    };

    return (
        <div className="admin-employers-container">
            <h2 className="admin-employers-title">All Employers Added</h2>

            <div className="admin-employers-search">
                <input
                    type="text"
                    placeholder="Search by name, ID, contact, business type..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="admin-employers-input"
                />
            </div>

            <div className="admin-employers-table-container">
                <table className="admin-employers-table">
                    <thead>
                        <tr>
                            <th>Employer (ID & Name)</th>
                            <th>Contact</th>
                            <th>Business Type</th>
                            <th>Location</th>
                            <th>Added By</th>
                            <th>Date & Time Added</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployers
                            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
                            .map((e) => (
                                <tr key={e.id}>
                                    <td>{e.id} - {e.name}</td>
                                    <td>{e.contact}</td>
                                    <td>{e.businessType}</td>
                                    <td>{e.location}</td>
                                    <td>{e.addedBy}</td>
                                    <td>{e.dateAdded}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllEmployersAdded;
