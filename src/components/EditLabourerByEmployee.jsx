import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import "./EditLabourerByEmployee.css";

const hinglishTaglines = [
 "Main expert hoon plumbing mein",
    "Mere haathon mein hunar hai painting ka",
    "Sab kaam perfect karta hoon masonry ka",
    "Electrician ka king hoon main",
    "Main hoon sabse tez painter",
    "Mazbooti se karta hoon construction ka kaam",
    "Lakdi ka boss, banaye har saaman ko dost!",
    "Kaath pe hathoda, sapne banaye toda-toda!",
    "Furniture ka jadoo, humse seekhe har naya mood!",
    "Current ka khel, humse seekhe har ek cell!",
    "Bijli ka jhatka, hum dete hain perfect latka!",
    "Wire mein jaan, hum banaye ghar ka samaan!",
    "Pipe ka raja, har leak ko kare saja!",
    "Pani ka flow, humse na koi ro-ro!",
    "Nalka ho ya tanki, hum hain asli masti ki khanki!",
    "Deewar ka ustaad, banaye ghar bemisaal!",
    "Eent aur cement, hum dete hain solid intent!",
    "Chhath ho ya makaan, humse banta hai pura samaan!",
    "Rang ka jadoogar, deewar banaye superstar!",
    "Brush mein hai dum, har ghar ko banaye hum yum!",
    "Colour ka blast, humse mile mast-mast!",
    "Hammer ka hero, banaye ghar ko zero se nero!",
    "Loha ya lakdi, humse sab hai sakdi!",
    "Kaam ka swag, humse seekhe har ek jag!",
    "Bijli ka funda, humse na koi chhupa chhunda!",
    "Switch ka style, hum banaye ghar ko smile!",
    "Watt ka power, humse chalta har ek tower!",
    "Tap se tapak, hum band karein ek jhatak!",
    "Pani ka pressure, humse mile perfect measure!",
    "Pipeline ka plan, hum hain asli super man!",
    "Cement ka josh, humse banta ghar ka hosh!",
    "Eent pe eent, hum dete hain perfect scent!",
    "Pillar ka power, humse chalta har ek floor!",
    "Rangon ka mela, humse ghar ka khel khela!",
    "Deewar ka fashion, humse mile colour ka passion!",
    "Paint ka hungama, humse ghar ka naya drama!",
    "Kaam mein speed, humse mile har ek need!",
    "Tools ka tashan, humse ghar ka pura fashion!",
    "Lakdi ka logic, humse banaye magic!",
    "Current ka craze, humse ghar mein light ka phase!",
    "Wire ka wonder, humse na koi blunder!",
    "Pani ka boss, humse na koi loss!",
    "Leak ka dushman, hum hain asli superhuman!",
    "Tank ka tanker, humse chalta pani ka anchor!",
    "Deewar ka dhamaal, humse ghar ka kamaal!",
    "Cement ka charm, humse ghar ka perfect arm!",
    "Makaan ka master, humse chalta har ek plaster!",
    "Rang ka rocket, humse ghar ka naya socket!",
    "Brush ka badshah, humse ghar ka naya shah!",
    "Colour ka khel, humse ghar ka har ek cell!",
    "Kaam ka king, humse chalta har ek wing!",
    "Tools ka tufaan, humse ghar ka pura imaan!",
    "Lakdi ka leader, humse ghar ka har ek feeder!",
    "Bijli ka baap, humse chalta har ek tap!",
    "Pipe ka prince, humse ghar ka har ek rinse!",
    "Deewar ka don, humse ghar ka har ek tone!",
];

const EditLabourerByEmployee = () => {
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [labourers, setLabourers] = useState([]);
  const [selectedLabourer, setSelectedLabourer] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const fetchLabourers = async () => {
    try {
      const res = await axiosInstance.post("/api/users/protected/fetch-labourer-profile", {
        name: searchName,
        phone: searchPhone,
      });
      if (res.data.success) {
        setLabourers(res.data.userRecords || []);
      } else {
        alert("No labourers found.");
        setLabourers([]);
      }
    } catch (err) {
      console.error("Error fetching labourers:", err);
      alert("Error fetching labourers.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedLabourer((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!selectedLabourer) {
      alert("Please select a labourer to update.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", selectedLabourer.id);
      formData.append("name", selectedLabourer.name);
      formData.append("skills", selectedLabourer.skills);
      formData.append("location", selectedLabourer.location);
      formData.append("tagline", selectedLabourer.tagline);
      formData.append("updatedOn", new Date().toISOString());
      formData.append("updatedBy", localStorage.getItem("employeeId")); // Assuming you store employeeId in localStorage

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await axiosInstance.post(
        "/api/users/protected/update-labourer-by-employee",
        formData
      );

      if (res.data.success) {
        alert("Labourer updated successfully.");
        setSelectedLabourer(null);
        setImagePreview(null);
        setImageFile(null);
        setLabourers([]);
      } else {
        alert("Update failed.");
      }
    } catch (err) {
      console.error("Error updating labourer:", err);
      alert("Update failed.");
    }
  };

  return (
    <div className="edit-labourer-employee-container">
      <h2 className="edit-labourer-employee-heading">Edit Labourer Profile</h2>

      {/* Search Section */}
      <div className="edit-labourer-employee-search">
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
        <button onClick={fetchLabourers}>Search</button>
      </div>

      {/* List of Labourers */}
      {labourers.length > 0 && !selectedLabourer && (
        <div className="edit-labourer-employee-list">
          <h3>Select a Labourer to Edit:</h3>
          {labourers.map((lab) => (
            <div
              key={lab.id}
              className="edit-labourer-employee-record"
              onClick={() => {
                setSelectedLabourer(lab);
                setImagePreview(lab.profileImage || "");
              }}
            >
              <img src={lab.profileImage} alt={lab.name} className="edit-labourer-employee-avatar" />
              <div>
                <p><strong>{lab.name}</strong></p>
                <p>{lab.skills}</p>
                <p>{lab.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Form */}
      {selectedLabourer && (
        <div className="edit-labourer-employee-form">
          <label>Name:</label>
          <input type="text" name="name" value={selectedLabourer.name} onChange={handleChange} />

          <label>Skills:</label>
          <input type="text" name="skills" value={selectedLabourer.skills} onChange={handleChange} />

          <label>Location:</label>
          <input type="text" name="location" value={selectedLabourer.location} onChange={handleChange} />

          <label>Tagline:</label>
          <select name="tagline" value={selectedLabourer.tagline} onChange={handleChange}>
            {hinglishTaglines.map((line, idx) => (
              <option key={idx} value={line}>{line}</option>
            ))}
          </select>

          <label>Profile Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <div className="edit-labourer-employee-image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}

          <button onClick={handleUpdate} className="edit-labourer-employee-update-btn">
            Update Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default EditLabourerByEmployee;
