import React from "react";
import "./CancellationAndRefundPolicy.css"; // or create a dedicated CSS file if you want

const CancellationAndRefundPolicy = () => {
  return (
    <div className="static-page-container">
      <div className="static-page-card">
        <h1 className="static-page-title">Cancellation & Refund Policy</h1>
        <p className="static-page-updated">Last updated: 2025</p>

        <section className="static-page-section">
          <h2>1. Introduction</h2>
          <p>
            This Cancellation &amp; Refund Policy explains how payments,
            cancellations and refunds are handled on the MazdoorMitr platform
            (<strong>“we”, “our”, “us”</strong>). By using MazdoorMitr, you
            agree to this policy in addition to our Terms &amp; Conditions and
            Privacy Policy.
          </p>
        </section>

        <section className="static-page-section">
          <h2>2. Nature of Services</h2>
          <p>
            MazdoorMitr is a technology platform that helps connect workers,
            employers and local shops. We facilitate:
          </p>
          <ul>
            <li>Viewing worker / employer / shop contact details</li>
            <li>Posting jobs, service requirements and marketplace posts</li>
            <li>Creating worker, employer and shop profiles</li>
          </ul>
          <p>
            We <strong>do not</strong> directly employ workers nor guarantee any
            job, contract or quality of work. Payments are primarily for
            platform services like contact views, listings or promotional
            features.
          </p>
        </section>

        <section className="static-page-section">
          <h2>3. Wallet &amp; Credits</h2>
          <p>
            MazdoorMitr may provide a wallet / credit system for activities
            such as:
          </p>
          <ul>
            <li>Employers adding money to view worker or shop contact numbers</li>
            <li>Workers earning money when their number is viewed</li>
            <li>Shops using promotional or listing services (if applicable)</li>
          </ul>
          <p>
            Amounts added to the MazdoorMitr wallet are generally treated as{" "}
            <strong>prepaid credits</strong> for using the platform and are{" "}
            <strong>non-refundable</strong>, except in cases of technical error
            or failed transaction as explained below.
          </p>
        </section>

        <section className="static-page-section">
          <h2>4. Cancellation of Services</h2>
          <h3>4.1 Contact Views</h3>
          <p>
            Once you view a worker, employer or shop&apos;s contact number and
            the system deducts the applicable amount from your wallet, this
            action <strong>cannot be cancelled</strong> and no refund will be
            issued for that view.
          </p>

          <h3>4.2 Job / Service / Jobs Posts</h3>
          <p>
            You may delete or close your job post, service requirement or other
            jobs post at any time from within the app. Deleting a post
            will <strong>not</strong> automatically entitle you to any refund of
            credits already used to create or promote that post.
          </p>

          <h3>4.3 Shop or Profile Deletion</h3>
          <p>
            If you choose to deactivate or delete your worker, employer or shop
            account, any remaining wallet balance will normally{" "}
            <strong>not be refunded</strong>, except in specific cases as
            mentioned in Section 5.
          </p>
        </section>

        <section className="static-page-section">
          <h2>5. Refunds</h2>
          <p>
            As a general rule, <strong>all successful payments</strong> for
            wallet top-ups, contact views, promotions or listings are{" "}
            <strong>non-refundable</strong>. However, refunds may be considered
            in the following exceptional situations:
          </p>

          <h3>5.1 Failed or Pending Transactions</h3>
          <p>
            If your account/wallet was <strong>debited</strong> but credits were{" "}
            <strong>not added</strong> to your MazdoorMitr account due to a
            technical issue:
          </p>
          <ul>
            <li>
              In many cases, the amount will be auto-reversed by your bank /
              payment provider within 5–7 working days.
            </li>
            <li>
              If the amount is not reversed, you can contact us with payment
              proof (transaction ID, time, screenshot).
            </li>
          </ul>
          <p>
            After verifying the transaction with our payment partner, we may
            either:
          </p>
          <ul>
            <li>Credit your MazdoorMitr wallet with equivalent amount, or</li>
            <li>Initiate a refund to your original payment method</li>
          </ul>

          <h3>5.2 Duplicate Payments</h3>
          <p>
            In case of accidental <strong>duplicate payment</strong> for the
            same service (e.g., double wallet recharge), we will verify the
            usage and may:
          </p>
          <ul>
            <li>Refund the extra amount, or</li>
            <li>Convert the extra amount into wallet credits</li>
          </ul>

          <h3>5.3 Platform Errors</h3>
          <p>
            If a technical error from our side causes you to be charged wrongly
            without receiving the service (e.g., you were charged for a contact
            view that failed repeatedly), we will review logs and, if confirmed,
            adjust your wallet or process a refund at our discretion.
          </p>
        </section>

        <section className="static-page-section">
          <h2>6. No Refund for Usage-based Services</h2>
          <p>
            For usage-based services such as:
          </p>
          <ul>
            <li>Viewing contact numbers</li>
            <li>Successfully posted listings / job posts</li>
            <li>Promotional boosts already given</li>
          </ul>
          <p>
            Once the service is delivered,{" "}
            <strong>no refund will be provided</strong>, even if:
          </p>
          <ul>
            <li>The worker/employer/shop does not respond to your call</li>
            <li>You do not hire or get hired</li>
            <li>You are not satisfied with the outcome of your conversation</li>
          </ul>
        </section>

        <section className="static-page-section">
          <h2>7. How to Request Support or Raise a Refund Query</h2>
          <p>
            If you believe there has been a payment error, failed transaction or
            duplicate charge, please contact us within{" "}
            <strong>7 days of the transaction</strong> with:
          </p>
          <ul>
            <li>Registered mobile number on MazdoorMitr</li>
            <li>Date and approximate time of payment</li>
            <li>Transaction ID / UTR / reference number</li>
            <li>Payment screenshot (if available)</li>
          </ul>
          <p>
            You can reach us at:
          </p>
          <p>
            <strong>Email:</strong> quickclap7@gmail.com
            <br />
            <strong>Contact form:</strong> Available on the Contact Us page
          </p>
        </section>

        <section className="static-page-section">
          <h2>8. Processing Time</h2>
          <p>
            Once a valid refund is approved by our team, we generally initiate
            it within <strong>7–10 working days</strong>. Actual time taken to
            reflect in your account depends on your bank, UPI app or payment
            gateway and is outside our control.
          </p>
        </section>

        <section className="static-page-section">
          <h2>9. Changes to this Policy</h2>
          <p>
            We may update this Cancellation &amp; Refund Policy from time to
            time. Any changes will be posted on this page with an updated “Last
            updated” date. We encourage you to review this policy periodically.
          </p>
        </section>

        <section className="static-page-section">
          <h2>10. Contact Us</h2>
          <p>
            For any questions or clarifications about this policy, you can
            contact our support team at{" "}
            <strong>quickclap7@gmail.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CancellationAndRefundPolicy;
