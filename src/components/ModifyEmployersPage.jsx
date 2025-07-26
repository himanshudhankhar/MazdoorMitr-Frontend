import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import "./ModifyEmployersPage.css";

const ModifyEmployerPage = () => {
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [employerList, setEmployerList] = useState([]);
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.post("/api/users/protected/fetch-employer-profile", {
        name: searchName,
        phone: searchPhone,
      });
      const res = response;

      const data = res.data.userRecords;
      console.log(res.data);
      if (Array.isArray(data) && data.length > 0) {
        setEmployerList(response.data.userRecords);
        setSelectedEmployer(null); // reset form
      } else if(res.data.success == false) {
        setEmployerList([]);
        setSelectedEmployer(null); // reset form
        alert(res.data.message);
      } else{
        setEmployerList([]);
        setSelectedEmployer(null); // reset form
        alert("No Employer found!!");
      }
    } catch (err) {
      console.error("Search failed:", err);
      alert("Error fetching employers.");
    }
  };

  const handleSelect = (employer) => {
    setSelectedEmployer(employer);
    setImagePreview(employer.profileImage || null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployer((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.entries(selectedEmployer).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await axiosInstance.post("/api/users/protected/save-employer-profile", formData);
      if (res.data.success) {
        alert("Employer profile updated.");
      } else {
        alert("Failed to update employer.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("Error saving profile.");
    }
  };

  return (
    <div className="modify-employer-page-container">
      <h2 className="modify-employer-page-title">Modify Employer Profile</h2>

      <div className="modify-employer-page-search">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by phone"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="modify-employer-page-list">
        {employerList.map((emp, idx) => (
          <div
            key={idx}
            className="modify-employer-page-record"
            onClick={() => handleSelect(emp)}
          >
            {emp.name} - {emp.phone}
          </div>
        ))}
      </div>

      {selectedEmployer && (
        <form className="modify-employer-page-form" onSubmit={(e) => e.preventDefault()}>
          <label>
            Name:
            <input type="text" name="name" value={selectedEmployer.name} onChange={handleChange} />
          </label>
          <label>
            Phone:
            <input type="text" name="phone" value={selectedEmployer.phone} onChange={handleChange} />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={selectedEmployer.email || ""} onChange={handleChange} />
          </label>
          <label>
            Location:
            <input type="text" name="location" value={selectedEmployer.location || ""} onChange={handleChange} />
          </label>

          <label>
            Upload New Image:
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>

          {imagePreview && (
            <div className="modify-employer-page-image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}

          <button className="modify-employer-page-submit-btn" onClick={handleSave}>
            Update Employer
          </button>
        </form>
      )}
    </div>
  );
};

export default ModifyEmployerPage;
