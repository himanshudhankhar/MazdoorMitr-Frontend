import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import "./AllTransactionsPage.css";

const AllTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [matchingProfiles, setMatchingProfiles] = useState([]);
  const [selectedWalletId, setSelectedWalletId] = useState(null);
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [walletSearchTerm, setWalletSearchTerm] = useState("");
  const [walletUserInfo, setWalletUserInfo] = useState(null);

  const handleWalletSearch = async () => {
    try {
      const res = await axiosInstance.post("/api/users/protected/transactions/get-user-by-wallet-id", {
        walletId: walletSearchTerm,
      });

      if (res.data && res.data.user) {
        setWalletUserInfo(res.data.user);
      } else {
        setWalletUserInfo(null);
      }
    } catch (err) {
      console.error("Error fetching user by wallet ID:", err);
      setWalletUserInfo(null);
    }
  };

  // Fetch all transactions (or filtered by walletId if selected)
  const fetchTransactions = async (walletId = null) => {
    console.log("reached here");
    try {
      const url = walletId
        ? `/api/users/protected/transactions/get-all-transactions?walletId=${walletId}`
        : "/api/users/protected/transactions/get-all-transactions";

      const res = await axiosInstance.get(url);
      setTransactions(res.data || []);
      setFilteredTransactions(res.data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions(selectedWalletId);
  }, [selectedWalletId]);

  useEffect(() => {
    const filtered = transactions.filter((txn) => {
      const matchesDate =
        !dateFilter ||
        new Date(txn.timestamp).toISOString().slice(0, 10) === dateFilter;

      return matchesDate;
    });
    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [dateFilter, transactions]);

  const handleSearchProfiles = async () => {
    try {
      const res = await axiosInstance.post(
        "/api/users/protected/search-wallet-id",
        { query: searchTerm }
      );
      setMatchingProfiles(res.data.profiles || []);
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
    }
  };

  const handleProfileSelect = (walletId) => {
    console.log("walletid " + walletId);
    setSelectedWalletId(walletId);
    setMatchingProfiles([]);
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = filteredTransactions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);

  return (
    <div className="all-transaction-pages-container">
      <h2 className="all-transaction-pages-heading">All Transactions</h2>

      <div className="all-transaction-pages-filters">
        <div>
          <label>Search Name or Phone:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter name or phone"
          />
          <button onClick={handleSearchProfiles}>Search</button>
        </div>

        <div className="all-transaction-pages-wallet-search">
          <label>Search User by Wallet ID:</label>
          <input
            type="text"
            value={walletSearchTerm}
            onChange={(e) => setWalletSearchTerm(e.target.value)}
            placeholder="Enter Wallet ID"
          />
          <button onClick={handleWalletSearch}>Search User</button>

          {walletUserInfo && (
            <div className="all-transaction-pages-wallet-result">
              <p><strong>Name:</strong> {walletUserInfo.name}</p>
              <p><strong>Phone:</strong> {walletUserInfo.phone}</p>
            </div>
          )}
        </div>

        {matchingProfiles.length > 0 && (
          <div className="all-transaction-pages-profiles-dropdown">
            <p>Select a profile:</p>
            {matchingProfiles.map((profile) => (
              <div
                key={profile.id}
                className="all-transaction-pages-profile-option"
                onClick={() => handleProfileSelect(profile.walletId)}
              >
                {profile.name} ({profile.phone}) - Wallet ID: {profile.walletId}
              </div>
            ))}
          </div>
        )}

        <div>
          <label>Date Filter:</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="all-transaction-pages-table-container">
        <table className="all-transaction-pages-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Type</th>
              <th>Giver Wallet</th>
              <th>Receiver Wallet</th>
              <th>Amount</th>
              <th>Platform Cut</th>
              <th>Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((txn) => (
              <tr key={txn.transactionId}>
                <td>{txn.transactionId}</td>
                <td>{txn.type}</td>
                <td>{txn.giverWalletId}</td>
                <td>{txn.receiverWalletId}</td>
                <td>₹{txn.amount}</td>
                <td>₹{txn.platformCut}</td>
                <td>{txn.status}</td>
                <td>{new Date(txn.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="all-transaction-pages-pagination">
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllTransactionsPage;
