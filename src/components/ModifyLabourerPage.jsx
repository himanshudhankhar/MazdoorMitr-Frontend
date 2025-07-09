import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import "./ModifyLabourerPage.css";

const hinglishTaglines = [
  "Har kaam mein expert hoon",
  "Mehnat se dar nahi lagta",
  "Samay ka pakka hoon",
  "Kaam perfect karta hoon",
  "Skill se bhara hoon",
  "Sab kaam perfect karta hoon masonry ka",
];

const ModifyLabourerPage = () => {
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [userRecords, setUserRecords] = useState([]);
  const [form, setForm] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const fetchLabourer = async () => {
    try {
      const res = await axiosInstance.post("/api/users/protected/fetch-labourer-profile", {
        name: searchName,
        phone: searchPhone,
      });
      const data = res.data.userRecords;
      if (Array.isArray(data) && data.length > 0) {
        setUserRecords(data);
        setForm(null); // reset form
      } else {
        alert("No labourer found.");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      alert("Error fetching profile.");
    }
  };

  const handleSelectRecord = (record) => {
    setForm(record);
    setImagePreview(record.imageUrl || null);
    setImageFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await axiosInstance.post("/api/users/protected/save-labourer-profile", formData);
      if (res.data.success) {
        alert("Profile updated successfully.");
      } else {
        alert("Update failed.");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Error saving profile.");
    }
  };

  return (
    <div className="modify-labourer-data-container">
      <h2 className="modify-labourer-data-heading">Modify Labourer Profile</h2>

      <div className="modify-labourer-data-search">
        <input
          type="text"
          placeholder="Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />
        <button onClick={fetchLabourer}>Search</button>
      </div>

      {userRecords.length > 0 && (
        <div className="modify-labourer-data-records-list">
          <h4>Select a record:</h4>
          {userRecords.map((record, index) => (
            <div className="modify-labourer-data-record" onClick={() => handleSelect(record)}>
              <h4>{record.name}</h4>
              <p>Phone: {record.phone}</p>
              <p>Location: {record.location}</p>
            </div>
          ))}
        </div>
      )}

      {form && (
        <form className="modify-labourer-data-form" onSubmit={handleSave}>
          <label>
            Name:
            <input type="text" name="name" value={form.name} onChange={handleChange} />
          </label>

          <label>
            Phone:
            <input type="text" name="phone" value={form.phone} onChange={handleChange} />
          </label>

          <label>
            Mobile:
            <input type="text" name="mobile" value={form.mobile || ""} onChange={handleChange} />
          </label>

          <label>
            Location:
            <input type="text" name="location" value={form.location} onChange={handleChange} />
          </label>

          <label>
            Skills:
            <input type="text" name="skills" value={form.skills} onChange={handleChange} />
          </label>

          <label>
            Tagline:
            <select name="tagline" value={form.tagline} onChange={handleChange}>
              {hinglishTaglines.map((line, i) => (
                <option key={i} value={line}>
                  {line}
                </option>
              ))}
            </select>
          </label>

          <label>
            Call Time From:
            <input
              type="time"
              name="callTimeStart"
              value={form.callTimeStart}
              onChange={handleChange}
            />
          </label>

          <label>
            Call Time To:
            <input
              type="time"
              name="callTimeEnd"
              value={form.callTimeEnd}
              onChange={handleChange}
            />
          </label>

          <label>
            Upload New Image:
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>

          {(imagePreview || form?.profileImage || form?.imageUrl) && (
            <div className="modify-labourer-data-image-preview">
              <img
                src={imagePreview || form.profileImage || form.imageUrl}
                alt="Preview"
              />
            </div>
          )}

          <button type="submit" className="modify-labourer-data-submit-btn">
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default ModifyLabourerPage;
