import React, { useState, useEffect } from "react";
import "./Wallet.css";
import axiosInstance from "../axiosConfig";
import { useRef } from "react";
function formatTimestamp(timestamp) {
  const ts = timestamp?._seconds || timestamp?.seconds;
  if (!ts) return "Invalid date";

  const date = new Date(ts * 1000);
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-IN", options);
}

const Wallet = () => {
  const [availableFunds, setAvailableFunds] = useState(0);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [transferMessage, setTransferMessage] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);
  const transferIdempotencyKeyRef = useRef(null);

  // current wallet id can be user or shop
  const currentWalletId =
    localStorage.getItem("userId") || localStorage.getItem("shopId") || null;

  useEffect(() => {
    const fetchWalletDetails = async () => {
      try {
        // Decide which ID to use based on last login type
        const accountType = localStorage.getItem("accountType"); // "USER" or "SHOP"

        let userId = null;
        let userTypeForBackend = null;

        if (accountType === "SHOP") {
          userId = localStorage.getItem("shopId");
          userTypeForBackend = "BusinessOwner";
        } else {
          // default to normal user
          userId = localStorage.getItem("userId");
          userTypeForBackend = "user";
        }

        if (!userId) return;

        const response = await axiosInstance.post(
          "/api/users/protected/wallet-details",
          { userId, userType: userTypeForBackend },
          { withCredentials: true },
        );

        const { balance, transactionHistory } = response.data;
        setAvailableFunds(balance || 0);
        setTransactions(transactionHistory || []);
      } catch (error) {
        console.error("Failed to fetch wallet details:", error);
      }
    };

    // const fetchWalletDetails = async () => {
    //     try {
    //         const userId =
    //             localStorage.getItem('userId') || localStorage.getItem('shopId');
    //         const userType = localStorage.getItem('userType');
    //         if (!userId) return;

    //         const response = await axiosInstance.post(
    //             '/api/users/protected/wallet-details',
    //             { userId, userType },
    //             { withCredentials: true }
    //         );

    //         const { balance, transactionHistory } = response.data;
    //         setAvailableFunds(balance || 0);
    //         setTransactions(transactionHistory || []);
    //     } catch (error) {
    //         console.error('Failed to fetch wallet details:', error);
    //     }
    // };

    fetchWalletDetails();
  }, []);

  const handleRecharge = () => {
    alert("Recharge API to be implemented.");
  };

  const handleTransfer = async () => {
    if (!upiId?.trim() || !transferAmount || Number(transferAmount) <= 0) {
      setTransferMessage("Please enter valid UPI ID and amount.");
      return;
    }

    // One idempotency key per transfer attempt (same key for double-click / retry)
    if (!transferIdempotencyKeyRef.current) {
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        transferIdempotencyKeyRef.current = crypto.randomUUID(); // exactly 36 chars
      } else {
        const hex = "0123456789abcdef";
        let s = "";
        for (let i = 0; i < 32; i++) s += hex[Math.floor(Math.random() * 16)];
        transferIdempotencyKeyRef.current = [
          s.slice(0, 8),
          s.slice(8, 12),
          s.slice(12, 16),
          s.slice(16, 20),
          s.slice(20, 32),
        ].join("-");
      }
    }
    const idempotencyKey = transferIdempotencyKeyRef.current;

    setTransferLoading(true);
    setTransferMessage("");

    try {
      const { data } = await axiosInstance.post(
        "/api/users/protected/wallet/withdraw",
        {
          upiAddress: upiId.trim(),
          amount: Number(transferAmount),
          idempotencyKey,
        },
        { withCredentials: true },
      );

      console.log("Fund transferred successfully:", data);
      setTransferMessage("Fund transferred successfully!");
      setAvailableFunds(
        data.newBalance ?? availableFunds - Number(transferAmount),
      );
      setTransferAmount("");
      setUpiId("");
      transferIdempotencyKeyRef.current = null;
    } catch (error) {
      console.error("Failed to transfer funds:", error);
      setTransferMessage("Failed to transfer funds. Please try again.");
    } finally {
      setTransferLoading(false);
    }
  };

  const handleShowAllTransactions = async () => {
    try {
      const userId =
        localStorage.getItem("userId") || localStorage.getItem("shopId");
      if (!userId) return;

      const response = await axiosInstance.post(
        "/api/users/protected/getAllWalletTransactions",
        { userId },
        { withCredentials: true },
      );

      const { transactions: allTransactions } = response.data;
      setTransactions(allTransactions || []);
    } catch (error) {
      console.error("Failed to fetch all transactions:", error);
    }
  };

  return (
    <div className="wallet-page-container">
      <h1>Wallet</h1>

      <div className="funds-section">
        <h2>Available Funds</h2>
        <p className="funds-amount">₹{availableFunds.toFixed(2)}</p>
      </div>

      <div className="recharge-section">
        <h2>Recharge Wallet</h2>
        <input
          type="number"
          placeholder="Enter amount to recharge"
          value={rechargeAmount}
          onChange={(e) => setRechargeAmount(e.target.value)}
        />
        <button onClick={handleRecharge}>Recharge</button>
      </div>

      <div className="transfer-section">
        <h2>Transfer to UPI</h2>
        <input
          type="text"
          placeholder="Enter UPI ID"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter amount to transfer"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
        />
        <button onClick={handleTransfer} disabled={transferLoading}>
            {transferLoading ? "Transferring..." : "Transfer"}
        </button>
        {transferMessage && (
          <p className="transfer-message">{transferMessage}</p>
        )}
      </div>

      <div className="transactions-section">
        <h2>Previous Transactions</h2>
        {transactions.length > 0 ? (
          <>
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Counterparty</th>
                  <th>Date</th>
                  <th>Amount (₹)</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const isCredit =
                    currentWalletId && tx.receiverWalletId === currentWalletId;
                  const isDebit =
                    currentWalletId && tx.giverWalletId === currentWalletId;

                  // Amount to show:
                  // - if I'm receiver → amount_credited
                  // - if I'm giver → amount_debited
                  // (fallback to tx.amount for old data)
                  let rawAmount = 0;
                  if (isCredit) {
                    rawAmount = tx.amount_credited ?? tx.amount ?? 0;
                  } else if (isDebit) {
                    rawAmount = tx.amount_debited ?? tx.amount ?? 0;
                  } else {
                    // Just in case, fallback to amount if neither matches
                    rawAmount = tx.amount ?? 0;
                  }

                  const amount = Number(rawAmount) || 0;

                  const direction = isCredit
                    ? "Credit (Received)"
                    : "Debit (Given)";

                  const purpose =
                    tx.transaction_type || tx?.otherDetails?.type || "—";

                  const displayType = `${direction} • ${purpose}`;

                  // pick the name if available, otherwise fall back to ID
                  const counterparty = isCredit
                    ? tx.giverName || tx.giverWalletId
                    : tx.receiverName || tx.receiverWalletId;

                  return (
                    <tr key={tx.id || tx.transactionId}>
                      <td title={counterparty || ""}>
                        {counterparty || "N/A"}
                      </td>
                      <td>{formatTimestamp(tx.timestamp || tx.createdAt)}</td>
                      <td>{amount.toFixed(2)}</td>
                      <td>{displayType}</td>
                      <td>{tx.status || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <button
              className="show-all-btn"
              onClick={handleShowAllTransactions}
            >
              Show All Transactions
            </button>
          </>
        ) : (
          <p>No transactions available.</p>
        )}
      </div>
    </div>
  );
};

export default Wallet;
