// import React, { useState, useEffect } from 'react';
// import './Wallet.css';
// import axiosInstance from '../axiosConfig';

// function formatTimestamp(timestamp) {
//     const ts = timestamp?._seconds || timestamp?.seconds;
//     if (!ts) return 'Invalid date';

//     const date = new Date(ts * 1000);
//     const options = {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: 'numeric',
//       minute: '2-digit',
//       hour12: true
//     };

//     return date.toLocaleString('en-IN', options);
//   }

// const Wallet = () => {
//     const [availableFunds, setAvailableFunds] = useState(0);
//     const [rechargeAmount, setRechargeAmount] = useState('');
//     const [transferAmount, setTransferAmount] = useState('');
//     const [upiId, setUpiId] = useState('');
//     const [transactions, setTransactions] = useState([]);

//     useEffect(() => {
//         const fetchWalletDetails = async () => {
//             try {
//                 const userId = localStorage.getItem("userId");
//                 if (!userId) return;
//                 const response = await axiosInstance.post('/api/users/protected/wallet-details', { userId }, { withCredentials: true });
//                 const { balance, transactionHistory } = response.data;
//                 setAvailableFunds(balance);
//                 setTransactions(transactionHistory || []);
//             } catch (error) {
//                 console.error("Failed to fetch wallet details:", error);
//             }
//         };

//         fetchWalletDetails();
//     }, []);

//     const handleRecharge = () => {
//         alert('Recharge API to be implemented.');
//     };

//     const handleTransfer = () => {
//         alert('Transfer API to be implemented.');
//     };

//     return (
//         <div className="wallet-page-container">
//             <h1>Wallet</h1>

//             <div className="funds-section">
//                 <h2>Available Funds</h2>
//                 <p className="funds-amount">₹{availableFunds.toFixed(2)}</p>
//             </div>

//             <div className="recharge-section">
//                 <h2>Recharge Wallet</h2>
//                 <input
//                     type="number"
//                     placeholder="Enter amount to recharge"
//                     value={rechargeAmount}
//                     onChange={(e) => setRechargeAmount(e.target.value)}
//                 />
//                 <button onClick={handleRecharge}>Recharge</button>
//             </div>

//             <div className="transfer-section">
//                 <h2>Transfer to UPI</h2>
//                 <input
//                     type="text"
//                     placeholder="Enter UPI ID"
//                     value={upiId}
//                     onChange={(e) => setUpiId(e.target.value)}
//                 />
//                 <input
//                     type="number"
//                     placeholder="Enter amount to transfer"
//                     value={transferAmount}
//                     onChange={(e) => setTransferAmount(e.target.value)}
//                 />
//                 <button onClick={handleTransfer}>Transfer</button>
//             </div>

//             <div className="transactions-section">
//                 <h2>Previous Transactions</h2>
//                 {transactions.length > 0 ? (
//                     <table className="transactions-table">
//                         <thead>
//                             <tr>
//                                 <th>UPI ID</th>
//                                 <th>Date</th>
//                                 <th>Amount (₹)</th>
//                                 <th>Type</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {transactions.map((transaction, index) => (
//                                 <tr key={index}>
//                                     <td>{transaction.upiId || 'N/A'}</td>
//                                     <td>{formatTimestamp(transaction.timestamp)}</td>
//                                     <td>{transaction.amount.toFixed(2)}</td>
//                                     <td>{transaction.type}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 ) : (
//                     <p>No transactions available.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Wallet;

import React, { useState, useEffect } from 'react';
import './Wallet.css';
import axiosInstance from '../axiosConfig';

function formatTimestamp(timestamp) {
    const ts = timestamp?._seconds || timestamp?.seconds;
    if (!ts) return 'Invalid date';

    const date = new Date(ts * 1000);
    const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };

    return date.toLocaleString('en-IN', options);
}

const Wallet = () => {
    const [availableFunds, setAvailableFunds] = useState(0);
    const [rechargeAmount, setRechargeAmount] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [upiId, setUpiId] = useState('');
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchWalletDetails = async () => {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) return;
                const response = await axiosInstance.post('/api/users/protected/wallet-details', { userId }, { withCredentials: true });
                const { balance, transactionHistory } = response.data;
                setAvailableFunds(balance);
                setTransactions(transactionHistory || []);
            } catch (error) {
                console.error("Failed to fetch wallet details:", error);
            }
        };

        fetchWalletDetails();
    }, []);

    const handleRecharge = () => {
        alert('Recharge API to be implemented.');
    };

    const handleTransfer = () => {
        alert('Transfer API to be implemented.');
    };

    const handleShowAllTransactions = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) return;
            const response = await axiosInstance.post('/api/users/protected/getAllWalletTransactions', { userId }, { withCredentials: true });
            const { transactions: allTransactions } = response.data;
            setTransactions(allTransactions || []);
        } catch (error) {
            console.error("Failed to fetch all transactions:", error);
        }
    };

    const currentWalletId = localStorage.getItem("userId");;

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
                <button onClick={handleTransfer}>Transfer</button>
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
                                    const isCredit = tx.receiverWalletId === currentWalletId;
                                    const direction = isCredit ? "Credit (Received)" : "Debit (Given)";
                                    const purpose = tx?.otherDetails?.type || "—";
                                    const displayType = purpose ? `${direction} • ${purpose}` : direction;

                                    // pick the name if available, otherwise fall back to ID
                                    const counterparty = isCredit
                                        ? tx.giverName || tx.giverWalletId
                                        : tx.receiverName || tx.receiverWalletId;

                                    return (
                                        <tr key={tx.id || tx.transactionId}>
                                            <td title={counterparty || ""}>{counterparty || "N/A"}</td>
                                            <td>{formatTimestamp(tx.timestamp)}</td>
                                            <td>{Number(tx.amount || 0).toFixed(2)}</td>
                                            <td>{displayType}</td>
                                            <td>{tx.status || "—"}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <button className="show-all-btn" onClick={handleShowAllTransactions}>
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
