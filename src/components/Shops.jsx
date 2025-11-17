// src/pages/Shops.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import "./Shops.css";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedShop, setSelectedShop] = useState(null);

  const getTodayHours = (hours = []) => {
    const todayName = dayNames[new Date().getDay()];
    return hours.find((h) => h.day === todayName);
  };

  const buildDisplayAddress = (shop) => {
    const contact = shop.contact || {};
    const parts = [
      contact.address,
      contact.city,
      contact.landmark,
      contact.pincode,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const fetchShops = async (query = "") => {
    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.get("/api/users/protected/shops", {
        params: { searchQuery: query },
        withCredentials: true,
      });

      const shopsData = res.data.shops || [];
      setShops(shopsData);
    } catch (err) {
      console.error("Error fetching shops:", err);
      setError("Unable to load shops. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchShops(searchQuery.trim());
  };

  const openShopModal = (shop) => {
    setSelectedShop(shop);
  };

  const closeModal = () => {
    setSelectedShop(null);
  };

  return (
    <div className="shops-page">
      <div className="shops-header">
        <h1 className="shops-title">Shops</h1>
        <p className="shops-subtitle">
          Browse shops and services on MazdoorMitr. Click a shop to see full details.
        </p>
      </div>

      {/* 🔍 Search Bar */}
      <form className="shops-search-bar" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search shops by name, category or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="shops-search-input"
        />
        <button type="submit" className="shops-search-button">
          Search
        </button>
      </form>

      {/* Status messages */}
      {loading && <p className="shops-status">Loading shops...</p>}
      {error && <p className="shops-error">{error}</p>}
      {!loading && !error && shops.length === 0 && (
        <p className="shops-status">No shops found. Try a different search.</p>
      )}

      {/* 🔹 Shops Grid */}
      <div className="shops-grid">
        {shops.map((shop) => {
          const basics = shop.basics || {};
          const todayHours = getTodayHours(shop.hours || []);
          const displayAddress = buildDisplayAddress(shop);

          return (
            <div
              key={shop._id || shop.id}
              className="shops-card"
              onClick={() => openShopModal(shop)}
            >
              <div className="shops-card-image-wrapper">
                <img
                  src={
                    shop.photoUrl ||
                    shop.imageUrl ||
                    "https://via.placeholder.com/300x200?text=Shop+Image"
                  }
                  alt={basics.shopName || shop.shopName || "Shop"}
                  className="shops-card-image"
                />
              </div>

              <div className="shops-card-body">
                {/* ✅ Shop name (NOT owner name) */}
                <h3 className="shops-card-title">
                  {basics.shopName || shop.shopName || "Shop Name"}
                </h3>

                {basics.tagline && (
                  <p className="shops-card-tagline">“{basics.tagline}”</p>
                )}

                <p className="shops-card-location">
                  {displayAddress || shop.address || "Location not available"}
                </p>

                <p className="shops-card-category">
                  {basics.category || shop.category || ""}
                </p>

                {/* Today's hours */}
                {todayHours && (
                  <p className="shops-card-timings">
                    Today:{" "}
                    {todayHours.open
                      ? `${todayHours.from || "--"} - ${todayHours.to || "--"}`
                      : "Closed"}
                  </p>
                )}

                {/* Status badge if present */}
                {shop.status && (
                  <p
                    className={`shops-card-status shops-status-${shop.status}`}
                  >
                    {shop.status}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔸 Modal with full shop details */}
      {selectedShop && (() => {
        const basics = selectedShop.basics || {};
        const displayAddress = buildDisplayAddress(selectedShop);
        const todayHours = getTodayHours(selectedShop.hours || []);

        const allItems =
          selectedShop.catalog?.items?.length > 0
            ? selectedShop.catalog.items
            : selectedShop.items || [];

        const allServices =
          selectedShop.catalog?.services?.length > 0
            ? selectedShop.catalog.services
            : selectedShop.services || [];

        const whatsapp =
          selectedShop.whatsapp ||
          basics.whatsapp ||
          selectedShop.contact?.whatsapp;

        return (
          <div className="shops-modal-overlay" onClick={closeModal}>
            <div
              className="shops-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="shops-modal-close" onClick={closeModal}>
                ✕
              </button>

              <div className="shops-modal-header">
                <div className="shops-modal-image-wrapper">
                  <img
                    src={
                      selectedShop.photoUrl ||
                      selectedShop.imageUrl ||
                      "https://via.placeholder.com/400x250?text=Shop+Image"
                    }
                    alt={basics.shopName || selectedShop.shopName || "Shop"}
                    className="shops-modal-image"
                  />
                </div>

                <div className="shops-modal-title-block">
                  <h2 className="shops-modal-title">
                    {basics.shopName || selectedShop.shopName || "Shop Name"}
                  </h2>

                  {basics.tagline && (
                    <p className="shops-modal-tagline">“{basics.tagline}”</p>
                  )}

                  <p className="shops-modal-location">
                    {displayAddress ||
                      selectedShop.address ||
                      "Location not available"}
                  </p>

                  {(basics.category || selectedShop.category) && (
                    <p className="shops-modal-category">
                      Category: {basics.category || selectedShop.category}
                    </p>
                  )}

                  {/* Today's hours */}
                  {todayHours && (
                    <p className="shops-modal-timings">
                      Today:{" "}
                      {todayHours.open
                        ? `${todayHours.from || "--"} - ${
                            todayHours.to || "--"
                          }`
                        : "Closed"}
                    </p>
                  )}

                  {/* Contact info */}
                  {selectedShop.phone && (
                    <p className="shops-modal-contact">
                      Phone: {selectedShop.phone}
                    </p>
                  )}
                  {whatsapp && (
                    <p className="shops-modal-contact">
                      WhatsApp: {whatsapp}
                    </p>
                  )}

                  {/* Status */}
                  {selectedShop.status && (
                    <p
                      className={`shops-modal-status shops-status-${selectedShop.status}`}
                    >
                      Status: {selectedShop.status}
                    </p>
                  )}

                  {/* Owner name */}
                  {selectedShop.name && (
                    <p className="shops-modal-owner">
                      Owner: {selectedShop.name}
                    </p>
                  )}
                </div>
              </div>

              {/* About */}
              {(basics.about || selectedShop.about) && (
                <div className="shops-modal-section">
                  <h3 className="shops-section-title">About</h3>
                  <p className="shops-description">
                    {basics.about || selectedShop.about}
                  </p>
                </div>
              )}

              {/* Items / Price list (ONLY in modal) */}
              {allItems.length > 0 && (
                <div className="shops-modal-section">
                  <h3 className="shops-section-title">Items</h3>
                  <div className="shops-items-list">
                    {allItems.map((item, idx) => (
                      <div key={idx} className="shops-item-row">
                        <span className="shops-item-name">
                          {item.name || "Item"}
                        </span>
                        <span className="shops-item-price">
                          {item.price ? `₹${item.price}` : ""}
                          {item.unit ? ` / ${item.unit}` : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services list (ONLY in modal) */}
              {allServices.length > 0 && (
                <div className="shops-modal-section">
                  <h3 className="shops-section-title">Services</h3>
                  <ul className="shops-services-list">
                    {allServices.map((service, idx) => (
                      <li key={idx} className="shops-service-pill">
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weekly Timings */}
              {selectedShop.hours?.length > 0 && (
                <div className="shops-modal-section">
                  <h3 className="shops-section-title">Weekly Timings</h3>
                  <div className="shops-hours-list">
                    {selectedShop.hours.map((h, idx) => (
                      <div key={idx} className="shops-hours-row">
                        <span className="shops-hours-day">{h.day}</span>
                        <span className="shops-hours-time">
                          {h.open
                            ? `${h.from || "--"} - ${h.to || "--"}`
                            : "Closed"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default Shops;
