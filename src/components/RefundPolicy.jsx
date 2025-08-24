import React from 'react';
import './StaticPages.css';

const RefundPolicy = () => (
    <div className="static-page-container">
        <h1>Refund Policy for MazdoorMitr</h1>
        <p><strong>Effective Date:</strong> August 24, 2025</p>

        <h2>1. Overview</h2>
        <p>
            MazdoorMitr ("we", "our", "us") connects labourers with employers. Our platform provides
            paid contact views—employers pay ₹10 per view, which is credited to the labourer's wallet.
            This Refund Policy governs how refunds may be processed for wallet credits or employer
            charges.
        </p>

        <h2>2. For Labourers (Wallet Credits)</h2>
        <ul>
            <li>
                Accrued wallet credits are non-refundable and cannot be withdrawn until the balance exceeds ₹50.
            </li>
            <li>
                If your account is deactivated without withdrawal, your wallet credits will be forfeited.
            </li>
            <li>
                In case of any error (e.g., wrong employer charges or duplicate deductions),
                please email <a href="mailto:satyawati459@gmail.com">satyawati459@gmail.com</a>
                with details such as date, time, and transaction IDs. We'll investigate and, where
                justified, adjust your wallet balance within 5 working days.
            </li>
        </ul>

        <h2>3. For Employers (Contact-View Charges)</h2>
        <ul>
            <li>
                Once earned, credits cannot be reversed retrospectively unless there is a demonstrable
                error (e.g., fraudulent or technical error).
            </li>
            <li>
                To request a refund for any invalid or duplicate deductions, email
                <a href="mailto:satyawati459@gmail.com">satyawati459@gmail.com</a>
                with transaction details. If validated, a refund or reversal will be processed within
                5 working days and credited back to the original payment method or wallet.
            </li>
            <li>
                Refunds will not be provided for legitimate contact views or if the labourer has
                received the contact as intended.
            </li>
        </ul>

        <h2>4. Refund Request Procedures</h2>
        <p>
            Please include the following when submitting a refund request:
        </p>
        <ul>
            <li>Full name (as on account)</li>
            <li>User type (Labourer or Employer)</li>
            <li>Date and time of the transaction</li>
            <li>Transaction or View ID</li>
            <li>Reason for the refund request</li>
        </ul>
        <p>
            We will acknowledge your request within 2 working days and complete processing within 5 working days.
        </p>

        <h2>5. Disclaimers</h2>
        <ul>
            <li>
                MazdoorMitr reserves the right to deny refunds for misuse or violations of our platform
                policies (e.g., fraud, multiple account misuse).
            </li>
            <li>
                All refunds, if approved, will be processed using the same source as the original payment,
                unless otherwise agreed upon.
            </li>
        </ul>

        <h2>6. Grievance Redressal</h2>
        <p>
            If you're dissatisfied with the outcome of your refund request, you may escalate the matter
            to our Grievance Officer:
        </p>
        <p>
            <strong>Grievance Officer:</strong> Satyawati <br />
            <strong>Email:</strong> <a href="mailto:satyawati459@gmail.com">satyawati459@gmail.com</a><br />
            <strong>Expected Response Time:</strong> Within 30 days of receipt.
        </p>

        <h2>7. Changes to the Policy</h2>
        <p>
            We may update this Refund Policy periodically. We will notify users of substantial changes via
            email or in-app notification. Your continued use of the platform implies acceptance of the updated policy.
        </p>
    </div>
);

export default RefundPolicy;
