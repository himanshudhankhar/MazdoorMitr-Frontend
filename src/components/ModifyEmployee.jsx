import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import "./ModifyEmployee.css";

const ModifyEmployee = () => {
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newAddress, setNewAddress] = useState("");

  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.post("/api/users/protected/employees/fetch", {
        name: searchName,
        phone: searchPhone,
      });
      if (res.data.success) {
        setEmployees(res.data.employees);
      } else {
        alert("No employee found.");
        setEmployees([]);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      alert("Error fetching employee.");
    }
  };

  const handleUpdate = async () => {
    if (!selectedEmployee || !newAddress) {
      alert("Select an employee and enter a new address.");
      return;
    }

    try {
      const res = await axiosInstance.post("/api/users/protected/employees/update-address", {
        id: selectedEmployee.id,
        address: newAddress,
      });
      if (res.data.success) {
        alert("Address updated successfully.");
        setSelectedEmployee(null);
        setNewAddress("");
        setEmployees([]);
      } else {
        alert("Update failed.");
      }
    } catch (err) {
      console.error("Error updating address:", err);
      alert("Update failed.");
    }
  };

  return (
    <div className="modify-employee-container">
      <h2 className="modify-employee-title">Modify Employee</h2>

      <div className="modify-employee-search">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Phone"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />
        <button onClick={fetchEmployees}>Search</button>
      </div>

      {employees.length > 0 && (
        <div className="modify-employee-list">
          <h3>Select Employee:</h3>
          {employees.map((emp) => (
            <div
              key={emp.id}
              className={`modify-employee-record ${
                selectedEmployee?.id === emp.id ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedEmployee(emp);
                setNewAddress(emp.address || "");
              }}
            >
              <p>Name: {emp.name}</p>
              <p>Phone: {emp.phone}</p>
              <p>Address: {emp.address}</p>
            </div>
          ))}
        </div>
      )}

      {selectedEmployee && (
        <div className="modify-employee-form">
          <h3>Selected Employee Details</h3>
          <div className="modify-employee-images">
            {selectedEmployee.profileImageUrl && (
              <div className="modify-employee-image-block">
                <p>Profile Image:</p>
                <img
                  src={selectedEmployee.profileImageUrl}
                  alt="Profile"
                  className="modify-employee-profile-img"
                />
              </div>
            )}

            {selectedEmployee.aadhaarImageUrl && (
              <div className="modify-employee-image-block">
                <p>Aadhaar Image:</p>
                <img
                  src={selectedEmployee.aadhaarImageUrl}
                  alt="Aadhaar"
                  className="modify-employee-aadhaar-img"
                />
              </div>
            )}
          </div>

          {selectedEmployee.createdAt && (
            <p className="modify-employee-joining-date">
              Joining Date: {new Date(selectedEmployee.createdAt).toLocaleDateString()}
            </p>
          )}

          <label>Update Address:</label>
          <input
            type="text"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <button onClick={handleUpdate}>Update Address</button>
        </div>
      )}
    </div>
  );
};

export default ModifyEmployee;
