import React, { useState } from 'react';
import './Wallet.css';

const Wallet = () => {
    const [availableFunds, setAvailableFunds] = useState(500); // Example starting funds
    const [rechargeAmount, setRechargeAmount] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [upiId, setUpiId] = useState('');
    const [transactions, setTransactions] = useState([
        { upiId: 'abc@upi', date: '2025-01-20', amount: 200, type: 'Debited' },
        { upiId: 'xyz@upi', date: '2025-01-18', amount: 300, type: 'Debited' },
        { upiId: '', date: '2025-01-15', amount: 500, type: 'Credited' },
    ]);

    const handleRecharge = () => {
        if (rechargeAmount > 0) {
            setAvailableFunds(availableFunds + parseFloat(rechargeAmount));
            setTransactions([
                ...transactions,
                {
                    upiId: '',
                    date: new Date().toISOString().split('T')[0],
                    amount: parseFloat(rechargeAmount),
                    type: 'Credited',
                },
            ]);
            setRechargeAmount('');
            alert('Recharge Successful!');
        } else {
            alert('Please enter a valid recharge amount.');
        }
    };

    const handleTransfer = () => {
        if (transferAmount > 0 && upiId) {
            if (transferAmount <= availableFunds) {
                setAvailableFunds(availableFunds - parseFloat(transferAmount));
                setTransactions([
                    ...transactions,
                    {
                        upiId: upiId,
                        date: new Date().toISOString().split('T')[0],
                        amount: parseFloat(transferAmount),
                        type: 'Debited',
                    },
                ]);
                setTransferAmount('');
                setUpiId('');
                alert('Transfer Successful!');
            } else {
                alert('Insufficient funds for the transfer.');
            }
        } else {
            alert('Please enter a valid transfer amount and UPI ID.');
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
                <button onClick={handleTransfer}>Transfer</button>
            </div>

            <div className="transactions-section">
                <h2>Previous Transactions</h2>
                {transactions.length > 0 ? (
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>UPI ID</th>
                                <th>Date</th>
                                <th>Amount (₹)</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td>{transaction.upiId || 'N/A'}</td>
                                    <td>{transaction.date}</td>
                                    <td>{transaction.amount.toFixed(2)}</td>
                                    <td>{transaction.type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No transactions available.</p>
                )}
            </div>
        </div>
    );
};

export default Wallet;
