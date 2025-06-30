import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import "./LabourersAddedPage.css";

const LabourersAddedPage = () => {
  const [labourers, setLabourers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLabourers = async (search = "") => {
    try {
      const response = await axiosInstance.get(
        `/api/users/protected/labourers-added?search=${encodeURIComponent(search)}`
      );
      console.log(response.data);
      setLabourers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch labourers:", error);
    }
  };

  useEffect(() => {
    fetchLabourers();
  }, []);

  const handleSearch = () => {
    fetchLabourers(searchTerm);
  };

  return (
    <div className="labourers-added-container">
      <h2 className="labourers-added-heading">Workers Added</h2>

      <div className="labourers-added-search-section">
        <input
          className="labourers-added-search-input"
          type="text"
          placeholder="Search by name, employee, location or date (YYYY-MM-DD)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="labourers-added-search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      <table className="labourers-added-table">
        <thead>
          <tr>
            <th>Labourer Name</th>
            <th>Added By</th>
            <th>Onboarded Date</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {labourers.length > 0 ? (
            labourers.map((labourer, index) => (
              <tr key={index}>
                <td>{labourer.labourerName}</td>
                <td>
                  {labourer.addedBy === "self"
                    ? "Self"
                    : labourer.createdBy || "Unknown"}
                </td>
                <td>{new Date(labourer.onboardingDate).toLocaleDateString()}</td>
                <td>{labourer.location}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No results found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LabourersAddedPage;
