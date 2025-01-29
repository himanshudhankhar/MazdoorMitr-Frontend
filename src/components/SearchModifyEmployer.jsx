import React, { useState } from "react";
import "./SearchModifyEmployer.css";

const dummyEmployers = [
  { id: 1, name: "Rajesh Sharma", location: "Delhi", mobileNumber: "9876543210", profileImage: "" },
  { id: 2, name: "Sandeep Mehta", location: "Mumbai", mobileNumber: "8765432109", profileImage: "" },
  { id: 3, name: "Amit Verma", location: "Delhi", mobileNumber: "7654321098", profileImage: "" },
];

const SearchModifyEmployer = () => {
  const [searchQuery, setSearchQuery] = useState({ name: "", location: "" });
  const [results, setResults] = useState([]);
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleSearch = () => {
    const filteredEmployers = dummyEmployers.filter((employer) =>
      (searchQuery.name && employer.name.toLowerCase().includes(searchQuery.name.toLowerCase())) ||
      (searchQuery.location && employer.location.toLowerCase().includes(searchQuery.location.toLowerCase()))
    );
    setResults(filteredEmployers);
  };

  const handleSelectEmployer = (employer) => {
    setSelectedEmployer(employer);
    setImagePreview(employer.profileImage);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployer((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setSelectedEmployer((prev) => ({ ...prev, profileImage: imageUrl }));
    }
  };

  const handleUpdate = () => {
    console.log("Updated Employer Data:", selectedEmployer);
    alert("Employer details updated successfully!");
    setSelectedEmployer(null);
  };

  return (
    <div className="search-modify-employer-container">
      <header className="search-modify-employer-header">
        <h1>Search & Modify Employer</h1>
      </header>

      <div className="search-modify-employer-search-container">
        <input type="text" placeholder="Name" value={searchQuery.name} onChange={(e) => setSearchQuery({ ...searchQuery, name: e.target.value })} />
        <input type="text" placeholder="Location" value={searchQuery.location} onChange={(e) => setSearchQuery({ ...searchQuery, location: e.target.value })} />
        <button onClick={handleSearch} className="search-modify-employer-btn">Search</button>
      </div>

      {results.length > 0 && (
        <div className="search-modify-employer-results-container">
          <h2>Search Results</h2>
          <ul>
            {results.map((employer) => (
              <li key={employer.id} onClick={() => handleSelectEmployer(employer)}>
                {employer.name} - {employer.location} - {employer.mobileNumber}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedEmployer && (
        <div className="search-modify-employer-card">
          <h2>Modify Employer Details</h2>
          <div className="search-modify-employer-image-section">
            {imagePreview && <img src={imagePreview} alt="Employer" className="search-modify-employer-image-preview" />}
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
          <div className="search-modify-employer-form-group">
            <label>Name:</label>
            <input type="text" name="name" value={selectedEmployer.name} onChange={handleChange} />
          </div>
          <div className="search-modify-employer-form-group">
            <label>Mobile Number:</label>
            <input type="text" name="mobileNumber" value={selectedEmployer.mobileNumber} disabled />
          </div>
          <div className="search-modify-employer-form-group">
            <label>Location:</label>
            <input type="text" name="location" value={selectedEmployer.location} onChange={handleChange} />
          </div>
          <button onClick={handleUpdate} className="search-modify-employer-btn">Update Employer</button>
        </div>
      )}

      <footer className="search-modify-employer-footer">
        <p>&copy; 2025 MazdoorMitr. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default SearchModifyEmployer;
