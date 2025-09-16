import React, { useState, useEffect } from 'react';
import './Home.css';
import axiosInstance from '../axiosConfig';

export default function Home() {
    const [profiles, setProfiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [contactNumber, setContactNumber] = useState('');
    const [contactLoading, setContactLoading] = useState(false);
    const [confirmationStep, setConfirmationStep] = useState(true);

    useEffect(() => {
        fetchTopProfiles();
    }, []);

    const fetchTopProfiles = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem("userId");
            if (!userId) return;
            const res = await axiosInstance.post('/api/users/protected/get-random-profiles', { id: userId }, { withCredentials: true });
            setProfiles(res.data.profiles || []);
        } catch (error) {
            console.error('Error fetching profiles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            if (!searchTerm.trim()) {
                fetchTopProfiles();
                return;
            }

            setLoading(true);
            const userId = localStorage.getItem("userId");
            if (!userId) return;
            const res = await axiosInstance.post(`/api/users/protected/search-profiles?query=${encodeURIComponent(searchTerm)}`, { id: userId }, { withCredentials: true });
            setProfiles(res.data.profiles || []);
        } catch (error) {
            console.error('Error searching profiles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const openModal = (profile) => {
        setSelectedProfile(profile);
        setContactNumber('');
        setConfirmationStep(true);
        setModalVisible(true);
    };

    const confirmAndFetchContact = async () => {
        try {
            setContactLoading(true);
            const selfId = localStorage.getItem("userId");
            const res = await axiosInstance.post('/api/users/protected/get-contact-number', {
                selfid: selfId,
                otheruserid: selectedProfile.id
            }, { withCredentials: true });

            setContactNumber(res.data.contactNumber || res.data.message);
        } catch (error) {
            console.error('Error fetching contact number:', error);
            setContactNumber('Error fetching contact number ' + error.message);
        } finally {
            setContactLoading(false);
        }
    };

    return (
        <div className="home-container">
            <h1 className="heading">Search Profiles</h1>

            <div className="search-bar-container">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search profiles here..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className="small-button" onClick={handleSearch}>Search</button>
            </div>

            <h2 className="subheading">Today's Top Performers</h2>

            {loading ? (
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="profile-card-row">
                    {profiles.length > 0 ? (
                        profiles.map((profile, index) => (
                            <div className="profile-card" key={index} onClick={() => openModal(profile)}>
                                <img
                                    src={profile.profileImage || "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?w=1060"}
                                    alt="Person"
                                    className="profile-image"
                                />
                                <div className="profile-info">
                                    <h3 className="profile-name">{profile.name}</h3>
                                    <p className="profile-profession">{profile.skills || "No Skills Provided"}</p>
                                    <p className="profile-address">{profile.location || "Location Unknown"}</p>
                                    <p className="profile-user-type">
                                        {profile.userType === "Employer" ? "Employer" : "Labourer"}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No profiles found.</p>
                    )}
                </div>
            )}

            {/* Modal */}
            {modalVisible && selectedProfile && (
                <div className="modal-overlay">
                    <div className="modal">
                        {confirmationStep ? (
                            <>
                                <h2>Do you want {selectedProfile.name}'s contact number?</h2>
                                <p>Note: ₹15 will be deducted from your account.</p>
                                <button className="modal-button" onClick={() => { setConfirmationStep(false); confirmAndFetchContact(); }} disabled={contactLoading}>
                                    {contactLoading ? 'Processing...' : 'Yes, confirm & proceed'}
                                </button>
                                <button className="modal-button cancel" onClick={() => setModalVisible(false)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <p><strong>Contact Number:</strong> {contactNumber}</p>
                                <button className="modal-button" onClick={() => setModalVisible(false)}>Close</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
