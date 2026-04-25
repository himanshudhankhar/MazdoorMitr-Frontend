import React, { useState, useEffect } from "react";
import "./Wallet.css";
import axiosInstance from "../axiosConfig";
import { useRef } from "react";

const YOUR_RAZORPAY_KEY_ID = "rzp_live_RoNYuHnX9kJVm7";


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
const WITHDRAWAL_FINAL_STATUSES = ["processed", "reversed", "failed"];
async function pollWithdrawalStatus({
  payoutId,
  axiosInstance,
  intervalMs = 3000,
  maxAttempts = 40,
  onStatus,
}) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const { data } = await axiosInstance.get(
        "/api/users/protected/wallet/withdrawal-status",
        { params: { payoutId }, withCredentials: true },
      );
      const status = (data?.status || "").toLowerCase();
      if (typeof onStatus === "function") onStatus(status, data);
      if (WITHDRAWAL_FINAL_STATUSES.includes(status)) {
        return { status, data };
      }
    } catch (err) {
      if (attempt === maxAttempts - 1) throw err;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return { status: "timeout", data: null };
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
  const [transferPhase, setTransferPhase] = useState("idle");

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

    fetchWalletDetails();
  }, []);
  const refreshWalletDetails = async () => {
    try {
      const accountType = localStorage.getItem("accountType");
      const userId =
        accountType === "SHOP"
          ? localStorage.getItem("shopId")
          : localStorage.getItem("userId");
      const userTypeForBackend =
        accountType === "SHOP" ? "BusinessOwner" : "user";
      if (!userId) return;
      const res = await axiosInstance.post(
        "/api/users/protected/wallet-details",
        { userId, userType: userTypeForBackend },
        { withCredentials: true },
      );
      setAvailableFunds(res.data?.balance ?? availableFunds);
      setTransactions(res.data?.transactionHistory ?? transactions);
    }
    catch (error) {
      console.log("Error in refreshing wallet balance", error)
    }
  };

  const handleRecharge = async () => {
    try {
      const amount = rechargeAmount; // make dynamic later

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


      const token = localStorage.getItem("authToken");

      // 🧾 Step 1: Create order
      const orderRes = await axiosInstance.post(
        "/api/users/protected/create-order",
        { amount },
      );

      const data = orderRes.data;

      if (!data.success) {
        alert("Failed to create order");
        return;
      }

      // 💳 Step 2: Razorpay Checkout
      const options = {
        key: YOUR_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "MazdoorMitr",
        description: "Wallet Recharge",

        handler: async function (response) {
          try {
            // 🔐 Step 3: Verify payment
            const verifyRes = await axiosInstance.post(
              "/api/users/protected/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verifyRes.data.success) {
              alert("Payment successful! Wallet updated.");
              refreshWalletDetails();
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            console.error("Verify error:", err);
            alert("Verification failed");
          }
        },

        prefill: {
          name: data.userName || accountType,
          // email: user.email || "",
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Recharge error:", error);
      alert(error?.response?.data?.error || "Something went wrong");
    }
  };

  const handleTransfer = async () => {
    // 🔐 Validate UPI
    if (!upiId?.trim() || !upiId.trim().includes("@")) {
      setTransferMessage("Incorrect UPI ID. Please enter a valid UPI ID.");
      return;
    }

    // 💰 Validate amount
    if (
      !transferAmount ||
      isNaN(transferAmount) ||
      Number(transferAmount) <= 0
    ) {
      setTransferMessage(
        "Amount should be a valid number greater than 0."
      );
      return;
    }

    const amount = Number(transferAmount);

    // (optional but good UX)
    if (amount > availableFunds) {
      setTransferMessage("Insufficient balance.");
      return;
    }

    setTransferLoading(true);
    setTransferPhase("processing");
    setTransferMessage("Submitting payout request...");

    try {
      const { data } = await axiosInstance.post(
        "/api/users/protected/request-payout",
        {
          upiId: upiId.trim(),
          amount,
        },
        { withCredentials: true }
      );

      if (data.success) {
        setTransferPhase("done");

        setTransferMessage(
          "Payout request submitted successfully. Amount has been deducted and will be processed within 72 hours."
        );

        // 💰 Update wallet UI immediately (since deduction is instant)
        setAvailableFunds((prev) => prev - amount);

        // 🧹 Reset form
        setTransferAmount("");
        setUpiId("");

        // 🔄 Optional: re-fetch from backend (recommended for consistency)
        await refreshWalletDetails();

      } else {
        setTransferMessage("Failed to submit payout request.");
        setTransferPhase("done");
      }

    } catch (error) {
      console.error("Payout request failed:", error);

      setTransferPhase("done");

      setTransferMessage(
        error?.response?.data?.error ||
        "Failed to submit payout request. Please try again."
      );
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
