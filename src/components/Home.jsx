// import React from 'react';
// import './Home.css';

// export default function Home() {
//     return (
//         <div className="home-container">
//             <h1 className="heading">Search Profiles</h1>
//             <div className="search-bar-container">
//                 <input 
//                     type="text" 
//                     className="search-bar" 
//                     placeholder="Search profiles here..." 
//                 />
//             </div>
//             <h2 className="subheading">Today's Top Performers</h2>
//             <div className="profile-card-row">
//                 <div className="profile-card">
//                     <img 
//                         src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?w=1060" 
//                         alt="Person" 
//                         className="profile-image"
//                     />
//                     <div className="profile-info">
//                         <h3 className="profile-name">John Doe</h3>
//                         <p className="profile-profession">Carpenter</p>
//                         <p className="profile-address">Delhi, India</p>
//                     </div>
//                 </div>
//                 <div className="profile-card">
//                     <img 
//                         src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?w=1060" 
//                         alt="Person" 
//                         className="profile-image"
//                     />
//                     <div className="profile-info">
//                         <h3 className="profile-name">Jane Smith</h3>
//                         <p className="profile-profession">Electrician</p>
//                         <p className="profile-address">Mumbai, India</p>
//                     </div>
//                 </div>
//                 <div className="profile-card">
//                     <img 
//                         src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?w=1060" 
//                         alt="Person" 
//                         className="profile-image"
//                     />
//                     <div className="profile-info">
//                         <h3 className="profile-name">Raj Kumar</h3>
//                         <p className="profile-profession">Plumber</p>
//                         <p className="profile-address">Kolkata, India</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }


import React, { useState, useEffect } from 'react';
import './Home.css';
import axiosInstance from '../axiosConfig'; // your axios setup

export default function Home() {
    const [profiles, setProfiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTopProfiles();
    }, []);

    const fetchTopProfiles = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem("userId");
            if (!userId) return;
            const res = await axiosInstance.post('/api/users/protected/get-random-profiles', {id: userId}, { withCredentials: true });
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
                fetchTopProfiles(); // if empty search, show random again
                return;
            }

            setLoading(true);
            const userId = localStorage.getItem("userId");
            if (!userId) return;
            const res = await axiosInstance.post(`/api/users/protected/search-profiles?query=${encodeURIComponent(searchTerm)}`, {id: userId}, { withCredentials: true });
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
                            <div className="profile-card" key={index}>
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
        </div>
    );
}
