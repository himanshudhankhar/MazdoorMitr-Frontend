import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import "./EmployersAddedPage.css";

const EmployersAddedPage = () => {
  const [employers, setEmployers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEmployers = async (search = "") => {
    try {
      const response = await axiosInstance.get(
        `/api/users/protected/employers-added?search=${encodeURIComponent(search)}`
      );
      setEmployers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch employers:", error);
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  const handleSearch = () => {
    fetchEmployers(searchTerm);
  };

  return (
    <div className="employers-added-container">
      <h2 className="employers-added-heading">Employers Added</h2>

      <div className="employers-added-search-section">
        <input
          className="employers-added-search-input"
          type="text"
          placeholder="Search by employer name, employee, location or date (YYYY-MM-DD)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="employers-added-search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      <table className="employers-added-table">
        <thead>
          <tr>
            <th>Employer Name</th>
            <th>Added By</th>
            <th>Onboarded Date</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {employers.length > 0 ? (
            employers.map((employer, index) => (
              <tr key={index}>
                <td>{employer.employerName}</td>
                <td>
                  {employer.addedBy === "self"
                    ? "Self"
                    : employer.employeeName || "Unknown"}
                </td>
                <td>
                  {employer.onboardingDate
                    ? new Date(employer.onboardingDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{employer.location || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No results found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployersAddedPage;
