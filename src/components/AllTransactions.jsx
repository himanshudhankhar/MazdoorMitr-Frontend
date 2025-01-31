import React, { useState, useEffect } from "react";
import "./AllTransactions.css"; // Import CSS

const AdminTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    useEffect(() => {
        const sampleData = [
            { id: 1, type: "credit", fromUserId: "U101", fromUserName: "Amit Kumar", toUserId: "U102", toUserName: "Rahul Sharma", amount: 50, date: "2025-01-31 14:30:00", transactionId: "T1001" },
            { id: 2, type: "credit", fromUserId: "U103", fromUserName: "Suresh Verma", toUserId: "U104", toUserName: "Ankit Singh", amount: 30, date: "2025-01-30 10:15:00", transactionId: "T1002" },
            { id: 3, type: "money_add", userId: "U105", walletId: "W2001", upiId: "upi123@bank", amount: 100, date: "2025-01-29 09:00:00", transactionId: "T1003", creditsBefore: 200, creditsAfter: 300 },
            { id: 4, type: "money_withdraw", userId: "U106", walletId: "W2002", upiId: "upi456@bank", amount: -50, date: "2025-01-28 12:45:00", transactionId: "T1004", creditsBefore: 300, creditsAfter: 250 },
        ];

        setTransactions(sampleData);
        setFilteredTransactions(sampleData);
    }, []);

    const handleSearch = (e) => {
        const searchQuery = e.target.value.toLowerCase();
        const filtered = transactions.filter((t) =>
            (t.fromUserName && t.fromUserName.toLowerCase().includes(searchQuery)) ||
            (t.toUserName && t.toUserName.toLowerCase().includes(searchQuery)) ||
            (t.userId && t.userId.toLowerCase().includes(searchQuery)) ||
            (t.walletId && t.walletId.toLowerCase().includes(searchQuery)) ||
            (t.upiId && t.upiId.toLowerCase().includes(searchQuery)) ||
            (t.transactionId && t.transactionId.toLowerCase().includes(searchQuery)) ||
            t.date.includes(searchQuery)
        );
        setFilteredTransactions(filtered);
    };

    return (
        <div className="admin-transaction-container">
            <h2 className="admin-transaction-title">All Transactions</h2>

            <input
                type="text"
                placeholder="Search by date, user, wallet, transaction ID, UPI ID..."
                onChange={handleSearch}
                className="admin-transaction-search-input"
            />

            <div className="admin-transaction-tables">
                {/* Credits Transactions Table */}
                <div className="admin-transaction-table-container">
                    <h3 className="admin-transaction-subtitle">Credits Transactions</h3>
                    <table className="admin-transaction-table">
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>From User (ID & Name)</th>
                                <th>To User (ID & Name)</th>
                                <th>Amount (Credits)</th>
                                <th>Date & Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions
                                .filter((t) => t.type === "credit")
                                .sort((a, b) => new Date(b.date) - new Date(a.date))
                                .map((t) => (
                                    <tr key={t.id}>
                                        <td>{t.transactionId}</td>
                                        <td>{t.fromUserId} - {t.fromUserName}</td>
                                        <td>{t.toUserId} - {t.toUserName}</td>
                                        <td className="admin-transaction-credit">{t.amount}</td>
                                        <td>{t.date}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* Money Transactions Table */}
                <div className="admin-transaction-table-container">
                    <h3 className="admin-transaction-subtitle">Money Transactions</h3>
                    <table className="admin-transaction-table">
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>User ID</th>
                                <th>Wallet ID</th>
                                <th>UPI ID</th>
                                <th>Amount (₹)</th>
                                <th>Credits Before</th>
                                <th>Credits After</th>
                                <th>Date & Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions
                                .filter((t) => t.type === "money_add" || t.type === "money_withdraw")
                                .sort((a, b) => new Date(b.date) - new Date(a.date))
                                .map((t) => (
                                    <tr key={t.id}>
                                        <td>{t.transactionId}</td>
                                        <td>{t.userId}</td>
                                        <td>{t.walletId}</td>
                                        <td>{t.upiId || "N/A"}</td>
                                        <td className={t.amount < 0 ? "admin-transaction-debit" : "admin-transaction-credit"}>{t.amount}</td>
                                        <td>{t.creditsBefore}</td>
                                        <td>{t.creditsAfter}</td>
                                        <td>{t.date}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminTransactions;
