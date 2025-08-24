import React from 'react';
import './StaticPages.css';

const PrivacyPolicy = () => (
    <div className="static-page-container">
        <h1>Privacy Policy for MazdoorMitr</h1>
        <p><strong>Effective Date:</strong> August 24, 2025</p>

        <h2>1. Introduction</h2>
        <p>
            MazdoorMitr ("we", "our", "us"), operated by Quickclap Solutions Pvt. Ltd., is a platform
            designed to connect blue-collar workers (“labourers”) with employers. This Privacy Policy explains
            how we collect, use, share, retain, and protect your personal information in compliance with the
            Information Technology Act, 2000 and applicable data protection rules in India.
        </p>

        <h2>2. Information We Collect</h2>
        <ul>
            <li><strong>Personal Information:</strong> Name, phone number, location, skills, and profile details.</li>
            <li><strong>Transactional Information:</strong> Wallet credits, withdrawals, and history of number views.</li>
            <li><strong>Authentication Data:</strong> OTP-verification logs, device/IP metadata.</li>
            {/* <li><strong>KYC Data (Optional):</strong> Aadhaar, biometric, or identity documents provided voluntarily.</li> */}
        </ul>

        <h2>3. Purpose of Processing</h2>
        <p>We process your data for the following purposes:</p>
        <ul>
            <li>To provide MazdoorMitr services, including contact-number sharing with employer consent and ₹10 wallet credit per view.</li>
            <li>To process wallet deductions, credits, and withdrawals (only for balances above ₹50).</li>
            <li>To verify identity through OTP and optional KYC, and to maintain platform security.</li>
            <li>To prevent fraud, resolve disputes, and provide customer support.</li>
            <li>To comply with applicable laws and legal obligations.</li>
        </ul>

        <h2>4. Contact Information Sharing Policy</h2>
        <p>
            By registering on MazdoorMitr, you provide explicit consent that your contact number may be shared
            with verified employers on our platform <strong>only for the purpose of job-related opportunities</strong>.
            Each time your number is viewed, ₹10 is deducted from the employer’s wallet and credited to your MazdoorMitr wallet.
        </p>
        <p>
            <strong>This does not constitute “selling data.”</strong> Your contact details are shared only with employers
            for job connection purposes and not with advertisers, marketers, or unrelated third parties.
        </p>
        <p>
            Employers are strictly prohibited from misusing this information (e.g., spam, harassment, non-job-related activities).
            Any violation can lead to suspension or termination of the employer’s account.
        </p>

        <h2>5. Consent, Review & Withdrawal</h2>
        <p>
            You may review and update your information through your profile settings. You may withdraw your consent
            at any time by deactivating your account, after which your data will be deleted within 72 hours, except where
            retention is legally required.
        </p>

        <h2>6. Sharing and Disclosure of Information</h2>
        <ul>
            <li>We do not sell your data to advertisers or unrelated parties.</li>
            <li>We may share information with service providers (e.g., SMS, payments) under strict confidentiality obligations.</li>
            <li>We may disclose data when required by law, legal process, or government authorities.</li>
        </ul>

        <h2>7. Data Retention</h2>
        <p>
            We retain data only as long as necessary to provide services, meet legal obligations, and resolve disputes.
            Wallet and transaction records may be kept for compliance purposes even after account deletion.
        </p>

        <h2>8. Security Practices</h2>
        <p>
            We implement reasonable security practices, including encryption, access controls, and monitoring systems,
            to protect your personal data. However, no system is entirely secure, and you share data at your own risk.
        </p>

        <h2>9. Notice & Takedown Policy</h2>
        <p>
            If you believe your contact information is being misused, or if unlawful content is posted on the platform,
            you may notify us. Upon verification, we will remove or restrict such content as per IT Act Section 79 obligations.
        </p>

        <h2>10. Data Breach Notification</h2>
        <p>
            In case of a data breach that could cause harm, we will notify affected users and relevant authorities as required by law.
        </p>

        <h2>11. Changes to This Policy</h2>
        <p>
            We may update this Privacy Policy from time to time. Users will be notified of major changes via app notifications or email.
            Continued use of the service after updates implies acceptance of the revised policy.
        </p>

        <h2>12. Grievance Officer</h2>
        <p>
            In compliance with the Information Technology Act, 2000 and rules thereunder, the name and contact details of the
            Grievance Officer are as follows:
        </p>
        <p>
            <strong>Grievance Officer:</strong> Satyawati<br/>
                <strong>Email:</strong> <a href="mailto:satyawati459@gmail.com">satyawati459@gmail.com</a><br/>
                    <strong>Response Time:</strong> Within 30 days of receiving a complaint.
                </p>
            </div>
            );

            export default PrivacyPolicy;
