import React, { useState } from "react";
import "./IncompleteProfiles.css";

const dummyProfiles = [
  { id: 1, name: "Ramesh Kumar", contact: "9876543210", location: "", type: "Labourer", skills: "", workExperience: "", status: "Pending", profilePic: "" },
  { id: 2, name: "Suresh Singh", contact: "8765432109", location: "Mumbai", type: "Employer", status: "Completed", profilePic: "" },
  { id: 3, name: "Amit Sharma", contact: "7654321098", location: "Delhi", type: "Labourer", skills: "Plumbing", workExperience: "4 years", status: "Pending", profilePic: "" },
];

const IncompleteProfiles = () => {
  const [profiles, setProfiles] = useState(dummyProfiles);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const openModal = (profile) => {
    setSelectedProfile(profile);
    setProfileData({ ...profile });
    setPreviewImage(profile.profilePic);
  };

  const closeModal = () => {
    setSelectedProfile(null);
    setPreviewImage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setProfileData((prev) => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteProfile = (e) => {
    e.preventDefault();
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileData.id ? { ...profileData, status: "Completed" } : p
      )
    );
    closeModal();
  };

  return (
    <div className="incomplete-profiles-container">
      <header className="incomplete-profiles-header">
        <h1>Incomplete Profiles</h1>
      </header>

      {profiles.length === 0 ? (
        <p className="incomplete-profiles-empty">No pending profiles!</p>
      ) : (
        <table className="incomplete-profiles-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Profile Pic</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Location</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id}>
                <td>{profile.id}</td>
                <td>
                  {profile.profilePic ? (
                    <img src={profile.profilePic} alt="Profile" className="profile-pic-thumbnail" />
                  ) : (
                    <span className="no-image">No Image</span>
                  )}
                </td>
                <td>{profile.name}</td>
                <td>{profile.contact}</td>
                <td>{profile.location || "Not Set"}</td>
                <td>{profile.type}</td>
                <td>{profile.status}</td>
                <td>
                  {profile.status === "Pending" && (
                    <button className="complete-btn" onClick={() => openModal(profile)}>
                      Complete Profile
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedProfile && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Complete Profile</h2>
            <form onSubmit={handleCompleteProfile}>
              <div className="form-group">
                <label>Profile Picture:</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {previewImage && <img src={previewImage} alt="Preview" className="profile-preview" />}
              </div>

              <div className="form-group">
                <label>Name:</label>
                <input type="text" name="name" value={profileData.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Location:</label>
                <input type="text" name="location" value={profileData.location} onChange={handleChange} required />
              </div>

              {selectedProfile.type === "Labourer" && (
                <>
                  <div className="form-group">
                    <label>Skills:</label>
                    <input type="text" name="skills" value={profileData.skills} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label>Work Experience:</label>
                    <input type="text" name="workExperience" value={profileData.workExperience} onChange={handleChange} />
                  </div>
                </>
              )}

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Save & Complete
                </button>
                <button type="button" className="close-btn" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="incomplete-profiles-footer">
        <p>&copy; 2025 MazdoorMitr. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default IncompleteProfiles;
