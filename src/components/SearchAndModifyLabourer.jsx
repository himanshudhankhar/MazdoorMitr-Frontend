import React, { useState } from "react";
import "./SearchAndModifyLabourer.css";

const dummyLabourers = [
  { 
    id: 1, 
    name: "Ramesh Kumar", 
    mobileNumber: "9876543210", 
    location: "Delhi", 
    skills: "Carpentry, Painting", 
    workExperience: "5 years", 
    profileImage: "https://via.placeholder.com/150" 
  },
  { 
    id: 2, 
    name: "Suresh Singh", 
    mobileNumber: "8765432109", 
    location: "Mumbai", 
    skills: "Electrician", 
    workExperience: "3 years", 
    profileImage: "https://via.placeholder.com/150" 
  },
  { 
    id: 3, 
    name: "Amit Sharma", 
    mobileNumber: "7654321098", 
    location: "Delhi", 
    skills: "Plumbing, Welding", 
    workExperience: "4 years", 
    profileImage: "https://via.placeholder.com/150" 
  },
];

const SearchModifyLabourer = () => {
  const [searchQuery, setSearchQuery] = useState({ name: "", mobile: "", skill: "", location: "" });
  const [results, setResults] = useState([]);
  const [selectedLabourer, setSelectedLabourer] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = () => {
    setError("");
    const filteredLabourers = dummyLabourers.filter((labourer) =>
      (searchQuery.name && labourer.name.toLowerCase().includes(searchQuery.name.toLowerCase())) ||
      (searchQuery.mobile && labourer.mobileNumber.includes(searchQuery.mobile)) ||
      (searchQuery.skill && labourer.skills.toLowerCase().includes(searchQuery.skill.toLowerCase())) ||
      (searchQuery.location && labourer.location.toLowerCase().includes(searchQuery.location.toLowerCase()))
    );

    if (filteredLabourers.length === 0) {
      setError("No labourers found!");
    }
    setResults(filteredLabourers);
  };

  const handleSelectLabourer = (labourer) => {
    setSelectedLabourer(labourer);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedLabourer((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    console.log("Updated Labourer Data:", selectedLabourer);
    alert("Labourer details updated successfully!");
    setSelectedLabourer(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedLabourer((prev) => ({ ...prev, profileImage: imageUrl }));
    }
  };

  return (
    <div className="search-modify-labourer-container">
      <header className="search-modify-labourer-header">
        <h1>Search & Modify Labourer</h1>
      </header>

      <div className="search-modify-labourer-search-container">
        <input type="text" placeholder="Name" value={searchQuery.name} onChange={(e) => setSearchQuery({ ...searchQuery, name: e.target.value })} />
        <input type="text" placeholder="Mobile Number" value={searchQuery.mobile} onChange={(e) => setSearchQuery({ ...searchQuery, mobile: e.target.value })} />
        <input type="text" placeholder="Skill" value={searchQuery.skill} onChange={(e) => setSearchQuery({ ...searchQuery, skill: e.target.value })} />
        <input type="text" placeholder="Location" value={searchQuery.location} onChange={(e) => setSearchQuery({ ...searchQuery, location: e.target.value })} />
        <button onClick={handleSearch} className="search-modify-labourer-search-btn">Search</button>
      </div>

      {error && <p className="search-modify-labourer-error">{error}</p>}

      {results.length > 0 && (
        <div className="search-modify-labourer-results-container">
          <h2>Search Results</h2>
          <ul>
            {results.map((labourer) => (
              <li key={labourer.id} onClick={() => handleSelectLabourer(labourer)}>
                <img src={labourer.profileImage} alt={labourer.name} className="search-modify-labourer-image" />
                <div>
                  {labourer.name} - {labourer.mobileNumber} - {labourer.location} - {labourer.skills}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedLabourer && (
        <div className="search-modify-labourer-update-container">
          <h2>Modify Labourer Details</h2>
          <div className="search-modify-labourer-form-group">
            <label>Profile Image:</label>
            <img src={selectedLabourer.profileImage} alt="Labourer" className="search-modify-labourer-image-large" />
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
          <div className="search-modify-labourer-form-group">
            <label>Name:</label>
            <input type="text" name="name" value={selectedLabourer.name} onChange={handleChange} />
          </div>
          <div className="search-modify-labourer-form-group">
            <label>Mobile Number:</label>
            <input type="text" name="mobileNumber" value={selectedLabourer.mobileNumber} disabled />
          </div>
          <div className="search-modify-labourer-form-group">
            <label>Location:</label>
            <input type="text" name="location" value={selectedLabourer.location} onChange={handleChange} />
          </div>
          <div className="search-modify-labourer-form-group">
            <label>Skills:</label>
            
            <textarea
                                    id="skills"
                                    name="skills"
                                    value={selectedLabourer.skills}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your skills"
                                    rows="4"
                                />
          </div>
          <div className="search-modify-labourer-form-group">
            <label>Work Experience:</label>
            <textarea
                                    id="workExperience"
                                    name="workExprience"
                                    value={selectedLabourer.workExperience}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your work experience"
                                    rows="4"
                                />
          </div>

          <button onClick={handleUpdate} className="search-modify-labourer-update-btn">Update Labourer</button>
        </div>
      )}
      <footer className="search-modify-labourer-footer">
        <p>&copy; 2025 MazdoorMitr. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default SearchModifyLabourer;
