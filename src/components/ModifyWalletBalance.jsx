import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import "./ModifyWalletBalance.css";

const ModifyWalletBalance = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    try {
      const res = await axiosInstance.post("/api/users/protected/admin/fetch-users-for-wallet", {
        searchQuery: searchQuery,
      });
      if (res.data.success) {
        setUsers(res.data.users);
      } else {
        setUsers([]);
        alert("No users found.");
      }
    } catch (err) {
      console.error("Search error:", err);
      alert("Failed to fetch users.");
    }
  };

  const handleModifyWallet = (user, type) => {
    setSelectedUser(user);
    setTransactionType(type);
    setErrorMessage("");
    setAmount("");
    setShowModal(true);
  };

  const confirmTransaction = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setErrorMessage("Enter a valid positive number.");
      return;
    }

    try {
      const route =
        transactionType === "add"
          ? "/api/users/protected/wallet/add-balance"
          : "/api/users/protected/wallet/deduct-balance";

      const res = await axiosInstance.post(route, {
        userId: selectedUser.id,
        amount: parseInt(amount),
      });

      if (res.data.success) {
        alert("Transaction successful");
        handleSearch(); // Refresh user list
        setShowModal(false);
      } else {
        alert(res.data.message || "Transaction failed");
      }
    } catch (err) {
      console.error("Transaction error:", err);
      alert("Transaction failed");
    }
  };

  return (
    <div className="admin-wallet-container">
      <h2 className="admin-wallet-title">Modify Wallet Balance</h2>

      <div className="admin-wallet-search">
        <input
          type="text"
          placeholder="Search by name, ID, or mobile number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="admin-wallet-input"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="admin-wallet-table-container">
        <table className="admin-wallet-table">
          <thead>
            <tr>
              <th>User (ID & Name)</th>
              <th>Mobile Number</th>
              <th>Wallet Balance</th>
              <th>Modify</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id} - {user.name}</td>
                <td>{user.phone}</td>
                <td>{user.walletBalance || 0} Credits</td>
                <td>
                  <button className="admin-wallet-add" onClick={() => handleModifyWallet(user, "add")}>Add</button>
                  <button className="admin-wallet-deduct" onClick={() => handleModifyWallet(user, "deduct")}>Deduct</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedUser && (
        <div className="admin-wallet-modal">
          <div className="admin-wallet-modal-content">
            <h3>Confirm Transaction</h3>
            <p>{transactionType === "add"
              ? `Add ${amount} credits to ${selectedUser.name}?`
              : `Deduct ${amount} credits from ${selectedUser.name}?`}
            </p>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="admin-wallet-modal-input"
            />
            {errorMessage && <p className="admin-wallet-error">{errorMessage}</p>}

            <div className="admin-wallet-modal-actions">
              <button onClick={confirmTransaction} className="admin-wallet-confirm">Confirm</button>
              <button onClick={() => setShowModal(false)} className="admin-wallet-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifyWalletBalance;
