import React, { useState } from "react";
import "./ModifyWalletBalance.css";

const ModifyWalletBalance = () => {
    const [users, setUsers] = useState([
        { id: "U101", name: "Rajesh Kumar", mobile: "9876543210", walletBalance: 500 },
        { id: "U102", name: "Anita Sharma", mobile: "9988776655", walletBalance: 800 },
        { id: "U103", name: "Vikas Verma", mobile: "9123456789", walletBalance: 300 },
    ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [amount, setAmount] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery) ||
        user.id.includes(searchQuery) ||
        user.mobile.includes(searchQuery)
    );

    const handleModifyWallet = (user, type) => {
        setSelectedUser(user);
        setTransactionType(type);
        setErrorMessage(""); // Reset error message
        setShowModal(true);
    };

    const confirmTransaction = () => {
        if (!amount || isNaN(amount) || amount <= 0) {
            setErrorMessage("Enter a valid positive number.");
            return;
        }

        const transactionAmount = parseInt(amount);
        if (transactionType === "deduct" && selectedUser.walletBalance < transactionAmount) {
            alert("Insufficient balance! Cannot deduct more credits than available.");
            return;
        }

        const updatedUsers = users.map(user =>
            user.id === selectedUser.id
                ? {
                    ...user,
                    walletBalance:
                        transactionType === "add"
                            ? user.walletBalance + transactionAmount
                            : user.walletBalance - transactionAmount,
                }
                : user
        );

        setUsers(updatedUsers);
        setShowModal(false);
        setAmount("");
    };

    return (
        <div className="admin-wallet-container">
            <h2 className="admin-wallet-title">Modify Wallet Balance</h2>

            <div className="admin-wallet-search">
                <input
                    type="text"
                    placeholder="Search by name, ID, or mobile number..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="admin-wallet-input"
                />
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
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.id} - {user.name}</td>
                                <td>{user.mobile}</td>
                                <td>{user.walletBalance} Credits</td>
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
                            ? `You are about to add ${amount} credits to ${selectedUser.name}.`
                            : `You are about to deduct ${amount} credits from ${selectedUser.name}.`
                        }</p>

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
