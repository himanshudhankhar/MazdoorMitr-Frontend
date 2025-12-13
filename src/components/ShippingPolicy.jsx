import React from "react";
import "./ShippingPolicy.css";

const ShippingPolicy = () => {
  return (
    <div className="shipping_policy_container">
      <div className="shipping_policy_card">
        <h1 className="shipping_policy_title">Shipping & Delivery Policy</h1>
        <p className="shipping_policy_updated">Last updated: 2025</p>

        {/* SECTION 1 */}
        <section className="shipping_policy_section">
          <h2 className="shipping_policy_heading">1. Overview</h2>
          <p className="shipping_policy_text">
            MazdoorMitr is a digital-only platform that connects workers,
            employers, and shops. We <strong>do not</strong> ship physical
            products. All services provided are digital in nature, including:
          </p>
          <ul className="shipping_policy_list">
            <li>Wallet recharges</li>
            <li>Viewing worker/employer/shop contact details</li>
            <li>Posting job or service requests</li>
            <li>Shop profile and catalog listings</li>
            <li>Promotional or digital services</li>
          </ul>
        </section>

        {/* SECTION 2 */}
        <section className="shipping_policy_section">
          <h2 className="shipping_policy_heading">2. Delivery of Digital Services</h2>

          <h3 className="shipping_policy_subheading">2.1 Wallet Recharge</h3>
          <p className="shipping_policy_text">
            Wallet top-ups are usually delivered instantly. In rare cases, it may take 
            up to <strong>30 minutes</strong> due to payment gateway delays.
          </p>

          <h3 className="shipping_policy_subheading">2.2 Viewing Contact Details</h3>
          <p className="shipping_policy_text">
            When credits are deducted, contact information is delivered 
            <strong> immediately on-screen.</strong>
          </p>

          <h3 className="shipping_policy_subheading">2.3 Job & Marketplace Posts</h3>
          <p className="shipping_policy_text">
            Your posts become visible within seconds across the platform.
          </p>

          <h3 className="shipping_policy_subheading">2.4 Shop Profiles & Catalog</h3>
          <p className="shipping_policy_text">
            Updates are published instantly. Shops under review may experience slight delays.
          </p>
        </section>

        {/* SECTION 3 */}
        <section className="shipping_policy_section">
          <h2 className="shipping_policy_heading">3. No Physical Shipping</h2>
          <p className="shipping_policy_text">
            MazdoorMitr does not deliver or sell physical goods. Therefore:
          </p>
          <ul className="shipping_policy_list">
            <li>No shipping charges apply</li>
            <li>No courier tracking numbers are generated</li>
            <li>No physical delivery timeline exists</li>
          </ul>
        </section>

        {/* SECTION 4 */}
        <section className="shipping_policy_section">
          <h2 className="shipping_policy_heading">4. Delays in Digital Delivery</h2>
          <p className="shipping_policy_text">
            Digital service delivery may be delayed due to:
          </p>
          <ul className="shipping_policy_list">
            <li>Payment gateway delays</li>
            <li>Server load or network issues</li>
            <li>Verification pending (for certain shop services)</li>
          </ul>
          <p className="shipping_policy_text">
            If not delivered within <strong>30 minutes</strong>, please contact customer support.
          </p>
        </section>

        {/* SECTION 5 */}
        <section className="shipping_policy_section">
          <h2 className="shipping_policy_heading">5. Failed Deliveries</h2>
          <p className="shipping_policy_text">
            If a digital service fails to activate, we will validate and refund/credit as per 
            our Refund Policy.
          </p>
        </section>

        {/* SECTION 6 */}
        <section className="shipping_policy_section">
          <h2 className="shipping_policy_heading">6. Contact Us</h2>
          <p className="shipping_policy_text">
            For issues related to digital service delivery:
          </p>
          <p className="shipping_policy_text">
            <strong>Email:</strong> quickclap7@gmail.com <br />
            <strong>Contact Form:</strong> Available on the Contact Us page
          </p>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;
