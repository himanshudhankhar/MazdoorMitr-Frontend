import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import "./ModifyLabourerPage.css";

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
      } else if(res.data.success == false) {
        setUserRecords([]);
        setForm(null); // reset form
        alert(res.data.message);
      } else{
        setUserRecords([]);
        setForm(null); // reset form
        alert("No Labourer found!!");
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
            <div className="modify-labourer-data-record" onClick={() => handleSelectRecord(record)}>
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
