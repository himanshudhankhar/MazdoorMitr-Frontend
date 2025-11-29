// src/pages/ReviewShops.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import "./ReviewShops.css"; // make sure file exists
// Optionally, wrap this page with your admin auth guard at route level

const STATUS_TABS = ["ALL", "PENDING_REVIEW", "APPROVED", "REJECTED"];

const ReviewShops = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [statusTab, setStatusTab] = useState("PENDING_REVIEW");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedShop, setSelectedShop] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // ===== helpers =====
  const getShopPhotoUrl = (shop) =>
    shop.photos ||
    shop.imageUrl ||
    (typeof shop.photos === "string" ? shop.photos : "") ||
    "https://via.placeholder.com/320x200?text=Shop+Image";

  const buildDisplayAddress = (shop) => {
    const c = shop.contact || {};
    const parts = [c.address, c.city, c.landmark, c.pincode].filter(Boolean);
    return parts.join(", ");
  };

  const formatDate = (ts) => {
    if (!ts) return "";
    const seconds = ts._seconds ?? ts.seconds;
    if (!seconds) return "";
    const d = new Date(seconds * 1000);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ===== fetch shops for review (admin API) =====
  const fetchShops = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.get(
        "/api/users/protected/shops-for-review",
        {
          params: {
            status: statusTab === "ALL" ? undefined : statusTab,
            search: search || undefined,
          },
          withCredentials: true,
        }
      );

      const list = res.data?.shops || [];
      setShops(list);
      setFilteredShops(list);
    } catch (err) {
      console.error("Error fetching shops for review:", err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load shop profiles."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusTab]);

  // optional: client-side filtering by search in addition to backend
  useEffect(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) {
      setFilteredShops(shops);
      return;
    }

    const filtered = shops.filter((shop) =>
      JSON.stringify(shop).toLowerCase().includes(needle)
    );
    setFilteredShops(filtered);
  }, [search, shops]);

  const handleTabClick = (tab) => {
    setStatusTab(tab);
  };

  const openModal = (shop) => {
    setSelectedShop(shop);
  };

  const closeModal = () => {
    setSelectedShop(null);
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedShop || !selectedShop.id) return;

    // Ask for confirmation first
    if (
      !window.confirm(
        `Are you sure you want to mark this shop as ${newStatus}?`
      )
    ) {
      return;
    }

    let body = { status: newStatus };
    let reasonToSave = null;

    // When rejecting, also capture reason
    if (newStatus === "REJECTED") {
      const reason = window.prompt("Please enter reason for rejection:");

      // User clicked Cancel in prompt
      if (reason === null) {
        return;
      }

      if (!reason.trim()) {
        alert("Reason is required when rejecting a shop.");
        return;
      }

      reasonToSave = reason.trim();
      body.reason = reasonToSave;
    }

    try {
      setUpdatingStatus(true);

      await axiosInstance.post(
        `/api/users/protected/shops/${selectedShop.id}/status`,
        body,
        { withCredentials: true }
      );

      // update local state (list)
      setShops((prev) =>
        prev.map((s) =>
          s.id === selectedShop.id
            ? {
                ...s,
                status: newStatus,
                reviewReason: newStatus === "REJECTED" ? reasonToSave : null,
              }
            : s
        )
      );
      setFilteredShops((prev) =>
        prev.map((s) =>
          s.id === selectedShop.id
            ? {
                ...s,
                status: newStatus,
                reviewReason: newStatus === "REJECTED" ? reasonToSave : null,
              }
            : s
        )
      );
      setSelectedShop((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              reviewReason: newStatus === "REJECTED" ? reasonToSave : null,
            }
          : prev
      );

      alert(`Shop status updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update shop status:", err);
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to update status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="review_shops_page">
      {/* Header */}
      <div className="review_shops_header">
        <div>
          <h1 className="review_shops_title">Review Shop Profiles</h1>
          <p className="review_shops_subtitle">
            Approve or reject shop profiles submitted by business owners.
          </p>
        </div>

        <div className="review_shops_tabs">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              className={
                "review_shops_tab" +
                (statusTab === tab ? " review_shops_tab_active" : "")
              }
              onClick={() => handleTabClick(tab)}
            >
              {tab === "ALL" ? "All" : tab.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="review_shops_search_row">
        <input
          className="review_shops_search_input"
          placeholder="Search by shop name, owner, city, category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="button"
          className="review_shops_btn review_shops_btn_outline"
          onClick={fetchShops}
          disabled={loading}
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* Status messages */}
      {loading && (
        <div className="review_shops_status">Loading shops for review…</div>
      )}
      {error && <div className="review_shops_error">{error}</div>}

      {!loading && !error && filteredShops.length === 0 && (
        <div className="review_shops_status">
          No shops found for this filter/search.
        </div>
      )}

      {/* Grid */}
      <div className="review_shops_grid">
        {filteredShops.map((shop) => {
          const basics = shop.basics || {};
          const address = buildDisplayAddress(shop);
          const itemsCount = shop.catalog?.items?.length || 0;
          const servicesCount = shop.catalog?.services?.length || 0;

          return (
            <div
              key={shop.id}
              className="review_shops_card"
              onClick={() => openModal(shop)}
            >
              <div className="review_shops_card_head">
                <div className="review_shops_card_title_block">
                  <h3 className="review_shops_card_title">
                    {basics.shopName || shop.shopName || "Unnamed Shop"}
                  </h3>
                  {basics.category && (
                    <span className="review_shops_chip">
                      {basics.category}
                    </span>
                  )}
                  {shop.status && (
                    <span
                      className={
                        "review_shops_status_chip review_shops_status_" +
                        (shop.status || "").toLowerCase()
                      }
                    >
                      {shop.status}
                    </span>
                  )}
                </div>

                <div className="review_shops_card_image_wrap">
                  <img
                    src={getShopPhotoUrl(shop)}
                    alt={basics.shopName || "Shop"}
                    className="review_shops_card_image"
                  />
                </div>
              </div>

              <p className="review_shops_card_text">
                {basics.about || "No description provided."}
              </p>

              <div className="review_shops_meta">
                <span className="review_shops_meta_line">
                  📍 {address || shop.address || "Address not set"}
                </span>
                {shop.name && (
                  <span className="review_shops_meta_line">
                    👤 Owner: {shop.name}
                  </span>
                )}
                {basics.whatsapp && (
                  <span className="review_shops_meta_line">
                    WhatsApp: {basics.whatsapp}
                  </span>
                )}
              </div>

              <div className="review_shops_counts_row">
                <span>Items: {itemsCount}</span>
                <span>Services: {servicesCount}</span>
              </div>

              <div className="review_shops_footer">
                <button
                  type="button"
                  className="review_shops_btn review_shops_btn_small"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(shop);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedShop &&
        (() => {
          const s = selectedShop;
          const basics = s.basics || {};
          const address = buildDisplayAddress(s);
          const items = s.catalog?.items || [];
          const services = s.catalog?.services || [];
          const updatedAt = formatDate(s.updatedAt);
          const createdAt =
            typeof s.createdAt === "number"
              ? new Date(s.createdAt).toLocaleString("en-IN")
              : "";

          return (
            <div
              className="review_shops_modal_overlay"
              onClick={closeModal}
            >
              <div
                className="review_shops_modal"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="review_shops_modal_close"
                  onClick={closeModal}
                >
                  ✕
                </button>

                <div className="review_shops_modal_header">
                  <div className="review_shops_modal_image_block">
                    <img
                      src={getShopPhotoUrl(s)}
                      alt={basics.shopName || "Shop"}
                      className="review_shops_modal_image"
                    />
                  </div>

                  <div className="review_shops_modal_title_block">
                    <h2 className="review_shops_modal_title">
                      {basics.shopName || s.shopName || "Shop Name"}
                    </h2>
                    {basics.tagline && (
                      <p className="review_shops_modal_tagline">
                        “{basics.tagline}”
                      </p>
                    )}

                    {address && (
                      <p className="review_shops_modal_line">
                        📍 {address}
                      </p>
                    )}

                    {(basics.category || s.category) && (
                      <p className="review_shops_modal_line">
                        Category: {basics.category || s.category}
                      </p>
                    )}

                    {s.name && (
                      <p className="review_shops_modal_line">
                        Owner: {s.name}
                      </p>
                    )}

                    {s.phone && (
                      <p className="review_shops_modal_line">
                        Phone: {s.phone}
                      </p>
                    )}

                    {basics.whatsapp && (
                      <p className="review_shops_modal_line">
                        WhatsApp: {basics.whatsapp}
                      </p>
                    )}

                    {s.status && (
                      <p className="review_shops_modal_line">
                        Status:{" "}
                        <span
                          className={
                            "review_shops_status_chip review_shops_status_" +
                            (s.status || "").toLowerCase()
                          }
                        >
                          {s.status}
                        </span>
                      </p>
                    )}

                    <p className="review_shops_modal_line">
                      Created: {createdAt || "—"}
                    </p>
                    {updatedAt && (
                      <p className="review_shops_modal_line">
                        Updated: {updatedAt}
                      </p>
                    )}

                    {s.reviewReason && (
                      <p className="review_shops_modal_line">
                        Rejection Reason: {s.reviewReason}
                      </p>
                    )}
                  </div>
                </div>

                {/* About */}
                {(basics.about || s.about) && (
                  <div className="review_shops_modal_section">
                    <h3 className="review_shops_section_title">About</h3>
                    <p className="review_shops_section_text">
                      {basics.about || s.about}
                    </p>
                  </div>
                )}

                {/* Catalog: Items */}
                {items.length > 0 && (
                  <div className="review_shops_modal_section">
                    <h3 className="review_shops_section_title">Items</h3>
                    <div className="review_shops_items_list">
                      {items.map((item, idx) => (
                        <div
                          key={idx}
                          className="review_shops_item_row"
                        >
                          <span className="review_shops_item_name">
                            {item.name || "Item"}
                          </span>
                          <span className="review_shops_item_price">
                            {item.price ? `₹${item.price}` : ""}
                            {item.unit ? ` / ${item.unit}` : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Catalog: Services */}
                {services.length > 0 && (
                  <div className="review_shops_modal_section">
                    <h3 className="review_shops_section_title">
                      Services
                    </h3>
                    <ul className="review_shops_services_list">
                      {services.map((service, idx) => (
                        <li
                          key={idx}
                          className="review_shops_service_pill"
                        >
                          {service.name || service}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Hours */}
                {s.hours?.length > 0 && (
                  <div className="review_shops_modal_section">
                    <h3 className="review_shops_section_title">
                      Weekly Timings
                    </h3>
                    <div className="review_shops_hours_list">
                      {s.hours.map((h, idx) => (
                        <div
                          key={idx}
                          className="review_shops_hours_row"
                        >
                          <span className="review_shops_hours_day">
                            {h.day}
                          </span>
                          <span className="review_shops_hours_time">
                            {h.open
                              ? `${h.from || "--"} - ${h.to || "--"}`
                              : "Closed"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Approve / Reject Buttons */}
                <div className="review_shops_modal_actions">
                  <button
                    type="button"
                    className="review_shops_btn review_shops_btn_danger"
                    disabled={updatingStatus}
                    onClick={() => handleStatusChange("REJECTED")}
                  >
                    {updatingStatus ? "Updating…" : "Reject"}
                  </button>
                  <button
                    type="button"
                    className="review_shops_btn review_shops_btn_success"
                    disabled={updatingStatus}
                    onClick={() => handleStatusChange("APPROVED")}
                  >
                    {updatingStatus ? "Updating…" : "Approve"}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default ReviewShops;
