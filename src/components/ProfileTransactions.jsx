import React, { useState } from "react";
import "./ProfileTransactions.css";

const dummyProfiles = [
  { id: 201, name: "Ramesh Kumar" },
  { id: 202, name: "Suresh Singh" },
  { id: 203, name: "Amit Sharma" },
];

const dummyTransactions = {
  201: [
    { id: 1, amount: 100, type: "Credited", method: "UPI: 9079161380@upi" },
    { id: 2, amount: 50, type: "Debited", method: "Service Fee" },
  ],
  202: [
    { id: 3, amount: 200, type: "Credited", method: "UPI" },
    { id: 4, amount: 70, type: "Debited", method: "Service Fee" },
  ],
  203: [
    { id: 5, amount: 150, type: "Credited", method: "UPI" },
  ],
};

const ProfileTransactions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = () => {
    const filteredProfiles = dummyProfiles.filter(
      (profile) =>
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.id.toString().includes(searchQuery)
    );

    if (filteredProfiles.length === 0) {
      setError("No profiles found!");
      setResults([]);
    } else {
      setError("");
      setResults(filteredProfiles);
    }
  };

  const handleSelectProfile = (profile) => {
    setSelectedProfile({ ...profile, transactions: dummyTransactions[profile.id] || [] });
  };

  return (
    <div className="profile-transactions-container">
      <header className="profile-transactions-header">
        <h1>Profile Transactions</h1>
      </header>

      <div className="profile-transactions-search">
        <input
          type="text"
          placeholder="Search by Name or ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="profile-transactions-search-btn">
          Search
        </button>
      </div>

      {error && <p className="profile-transactions-error">{error}</p>}

      {results.length > 0 && (
        <div className="profile-transactions-results">
          <h2>Select Profile</h2>
          <ul>
            {results.map((profile) => (
              <li key={profile.id} onClick={() => handleSelectProfile(profile)}>
                {profile.name} (ID: {profile.id})
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedProfile && (
        <div className="profile-transactions-details">
          <h2>Transactions for {selectedProfile.name} (ID: {selectedProfile.id})</h2>
          {selectedProfile.transactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Method</th>
                </tr>
              </thead>
              <tbody>
                {selectedProfile.transactions.map((txn) => (
                  <tr key={txn.id}>
                    <td>{txn.id}</td>
                    <td>₹{txn.amount}</td>
                    <td className={txn.type === "Credited" ? "credit" : "debit"}>{txn.type}</td>
                    <td>{txn.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <footer className="profile-transactions-footer">
        <p>&copy; 2025 MazdoorMitr. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default ProfileTransactions;
