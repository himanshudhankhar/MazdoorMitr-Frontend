import React, { useState, useEffect } from "react";
import "./AllLabourersAdded.css"; // Import CSS

const AllLabourersAdded = () => {
    const [labourers, setLabourers] = useState([]);
    const [filteredLabourers, setFilteredLabourers] = useState([]);

    useEffect(() => {
        const sampleData = [
            { id: "L101", name: "Amit Kumar", addedById: "E001", addedByName: "Rajesh Verma", location: "Delhi", skills: "Carpenter", contact: "9876543210", dateAdded: "2025-02-01 10:30:00" },
            { id: "L102", name: "Rahul Sharma", addedById: "Self", addedByName: "Self", location: "Mumbai", skills: "Plumber", contact: "9123456789", dateAdded: "2025-01-30 15:45:00" },
            { id: "L103", name: "Deepak Yadav", addedById: "E002", addedByName: "Neha Sharma", location: "Bangalore", skills: "Electrician", contact: "9865321478", dateAdded: "2025-01-29 14:15:00" },
        ];

        setLabourers(sampleData);
        setFilteredLabourers(sampleData);
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = labourers.filter((l) =>
            l.name.toLowerCase().includes(query) ||
            l.id.toLowerCase().includes(query) ||
            l.addedByName.toLowerCase().includes(query) ||
            l.addedById.toLowerCase().includes(query) ||
            l.location.toLowerCase().includes(query) ||
            l.skills.toLowerCase().includes(query) ||
            l.contact.includes(query) ||
            l.dateAdded.includes(query)
        );
        setFilteredLabourers(filtered);
    };

    return (
        <div className="admin-labourers-container">
            <h2 className="admin-labourers-title">All Labourers Added</h2>

            <input
                type="text"
                placeholder="Search by name, ID, skills, location, contact, or date..."
                onChange={handleSearch}
                className="admin-labourers-search-input"
            />

            <div className="admin-labourers-table-container">
                <table className="admin-labourers-table">
                    <thead>
                        <tr>
                            <th>Labourer (ID & Name)</th>
                            <th>Added By (ID & Name)</th>
                            <th>Location</th>
                            <th>Skills</th>
                            <th>Contact</th>
                            <th>Date & Time Added</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLabourers
                            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
                            .map((l) => (
                                <tr key={l.id}>
                                    <td>{l.id} - {l.name}</td>
                                    <td>{l.addedById === "Self" ? "Self" : `${l.addedById} - ${l.addedByName}`}</td>
                                    <td>{l.location}</td>
                                    <td>{l.skills}</td>
                                    <td>{l.contact}</td>
                                    <td>{l.dateAdded}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllLabourersAdded;
