import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import "./RegisteredLabourersByEmployee.css";

const RegisteredLabourersByEmployee = () => {
  const [labourersData, setLabourersData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabourers = async () => {
      try {
        const employeeId = localStorage.getItem("userId");
        if (!employeeId) {
          alert("Employee ID not found in local storage.");
          return;
        }

        const res = await axiosInstance.post(
          "/api/users/protected/labourers-by-employee",
          { employeeId }
        );

        if (res.data.success) {
          setLabourersData(res.data.labourers || []);
        } else {
          alert(res.data.message || "Failed to fetch labourers.");
        }
      } catch (error) {
        console.error("Error fetching labourers:", error);
        alert("Error fetching labourers.");
      } finally {
        setLoading(false);
      }
    };

    fetchLabourers();
  }, []);

  // Group labourers by date
  const groupByDate = () => {
    const grouped = {};
    labourersData.forEach((labourer) => {
      const date = labourer.createdAt
        ? new Date(labourer.createdAt).toLocaleDateString()
        : "Unknown Date";
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(labourer);
    });
    return grouped;
  };

  const groupedLabourers = groupByDate();

  return (
    <div className="registered-labourers-container">
      <h2 className="registered-labourers-title">Labourers Registered By You</h2>

      {loading ? (
        <p>Loading labourers...</p>
      ) : Object.keys(groupedLabourers).length === 0 ? (
        <p>No labourers registered yet.</p>
      ) : (
        Object.keys(groupedLabourers).map((date) => (
          <div key={date} className="registered-labourers-date-section">
            <h3 className="registered-labourers-date-header">
              {date} - Total: {groupedLabourers[date].length}
            </h3>
            <div className="registered-labourers-list">
              {groupedLabourers[date].map((labourer) => (
                <div
                  key={labourer.id}
                  className="registered-labourers-card"
                >
                  <img
                    src={labourer.profileImageUrl || "/default-profile.png"}
                    alt={labourer.name}
                    className="registered-labourers-image"
                  />
                  <div>
                    <p><strong>Name:</strong> {labourer.name}</p>
                    <p><strong>Phone:</strong> {labourer.phone}</p>
                    <p><strong>Location:</strong> {labourer.location}</p>
                    <p><strong>Skills:</strong> {labourer.skills}</p>
                    <p><strong>Tagline:</strong> {labourer.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RegisteredLabourersByEmployee;
