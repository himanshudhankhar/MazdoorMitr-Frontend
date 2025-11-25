// ShopDashboard.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import "./ShopDashboard.css";
import { useNavigate } from "react-router-dom";

export default function ShopDashboard() {
  const navigate = useNavigate();
  const [myShop, setMyShop] = useState(null);
  const [loadingMyShop, setLoadingMyShop] = useState(true);
  const [myShopError, setMyShopError] = useState("");

  const [tab, setTab] = useState("shops"); // "shops" | "workers"
  const [search, setSearch] = useState("");
  const [shops, setShops] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loadingExplore, setLoadingExplore] = useState(false);
  const [exploreError, setExploreError] = useState("");

  // NEW: state for explore-shop modal + contact reveal
  const [selectedShop, setSelectedShop] = useState(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState("");
  const [contactInfo, setContactInfo] = useState(null);

  const userType = localStorage.getItem("userType");

  // ====== FETCH OWN SHOP ======
  useEffect(() => {
    // Only BusinessOwner can access this page
    if (userType !== "BusinessOwner") {
      navigate("/app/home");
      return;
    }

    async function fetchMyShop() {
      setLoadingMyShop(true);
      setMyShopError("");
      try {
        const res = await axiosInstance.get("/api/users/protected/shops/me");
        setMyShop(res.data.shop || null);
      } catch (err) {
        console.error("fetchMyShop error:", err);
        setMyShopError(
          err?.response?.data?.error || "Failed to load your shop profile"
        );
      } finally {
        setLoadingMyShop(false);
      }
    }
    fetchMyShop();
  }, [navigate, userType]);

  // ====== FETCH OTHER SHOPS / WORKERS ======
  async function fetchExplore() {
    setLoadingExplore(true);
    setExploreError("");

    try {
      if (tab === "shops") {
        const res = await axiosInstance.get("/api/users/protected/shops", {
          params: { search: search || undefined },
        });
        setShops(res.data.shops || []);
      } else {
        const res = await axiosInstance.post(
          "/api/users/protected/search-profiles",
          { query: search || "" }
        );
        setWorkers(res.data.profiles || []);
      }
    } catch (err) {
      console.error("fetchExplore error:", err);
      setExploreError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          `Failed to load ${tab === "shops" ? "shops" : "workers"}`
      );
    } finally {
      setLoadingExplore(false);
    }
  }

  useEffect(() => {
    fetchExplore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const getShopPhotoUrl = (shop) =>
    shop?.photoUrl ||
    shop?.photos?.imageUrl ||
    shop?.photos?.logoUrl ||
    "";

  const formatCreatedAt = (createdAt) => {
    if (!createdAt) return "";
    let ms = createdAt;
    if (typeof createdAt === "object") {
      const secs = createdAt._seconds ?? createdAt.seconds;
      if (typeof secs === "number") ms = secs * 1000;
    }
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatHoursSummary = (hoursArr) => {
    if (!Array.isArray(hoursArr) || hoursArr.length === 0) return "";
    const allSame =
      hoursArr.every((h) => h.open) &&
      hoursArr.every(
        (h) => h.from === hoursArr[0].from && h.to === hoursArr[0].to
      );
    if (allSame) {
      return `Daily ${hoursArr[0].from}–${hoursArr[0].to}`;
    }
    const first = hoursArr[0];
    const last = hoursArr[hoursArr.length - 1];
    return `${first.day}–${last.day} ${first.from}–${first.to}`;
  };

  const openShopModal = (shop) => {
    setSelectedShop(shop);
    setContactInfo(null);
    setContactError("");
    setContactLoading(false);
  };

  const closeShopModal = () => {
    setSelectedShop(null);
    setContactInfo(null);
    setContactError("");
    setContactLoading(false);
  };

  const handleGetContact = async () => {
    if (!selectedShop) return;
    try {
      setContactLoading(true);
      setContactError("");
      setContactInfo(null);

      const res = await axiosInstance.post(
        `/api/users/protected/profile-view/${selectedShop.id}/reveal-contact`,
        {},
        { withCredentials: true }
      );

      const data = res.data || {};
      if (data.success === false) {
        setContactError(data.message || "Failed to get contact.");
        return;
      }

      setContactInfo({
        phone: data.phone || null,
        whatsapp: data.whatsapp || null,
      });

      if (data.message) {
        // optional toast/alert
        console.log("Contact reveal:", data.message);
      }
    } catch (err) {
      console.error("Get contact error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to get contact.";
      setContactError(msg);
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="shop_dashboard_page">
      {/* ====== OWN SHOP SECTION ====== */}
      <section className="shop_dashboard_section">
        <div className="shop_dashboard_section_head">
          <h2 className="shop_dashboard_title">My Shop</h2>
          <a
            href="/app/complete-shop-profile"
            className="shop_dashboard_btn shop_dashboard_btn_primary"
          >
            Edit Profile
          </a>
        </div>

        {loadingMyShop && (
          <div className="shop_dashboard_muted">Loading your shop…</div>
        )}

        {myShopError && (
          <div className="shop_dashboard_error">{myShopError}</div>
        )}

        {!loadingMyShop && !myShop && !myShopError && (
          <div className="shop_dashboard_muted">
            You have not created your shop profile yet.
            <br />
            <a
              href="/app/complete-shop-profile"
              className="shop_dashboard_btn shop_dashboard_btn_outline"
            >
              Create Shop Profile
            </a>
          </div>
        )}

        {myShop && (
          <div className="shop_dashboard_card shop_dashboard_myshop">
            <div className="shop_dashboard_myshop_main">
              <div className="shop_dashboard_myshop_header">
                <div>
                  <h3 className="shop_dashboard_myshop_name">
                    {myShop.basics?.shopName || "Unnamed Shop"}
                  </h3>
                  <div className="shop_dashboard_chip">
                    {myShop.basics?.category || "Category not set"}
                  </div>
                  {myShop.basics?.tagline && (
                    <div className="shop_dashboard_tagline">
                      {myShop.basics.tagline}
                    </div>
                  )}
                </div>
                {getShopPhotoUrl(myShop) && (
                  <img
                    className="shop_dashboard_myshop_image"
                    src={getShopPhotoUrl(myShop)}
                    alt="Shop"
                  />
                )}
              </div>

              <p className="shop_dashboard_about">
                {myShop.basics?.about || "No description added yet."}
              </p>

              <div className="shop_dashboard_two_col">
                <div>
                  <h4 className="shop_dashboard_subtitle">Contact</h4>
                  <div className="shop_dashboard_kv">
                    <span className="shop_dashboard_k">WhatsApp</span>
                    <span className="shop_dashboard_v">
                      {myShop.basics?.whatsapp || "Not set"}
                    </span>

                    <span className="shop_dashboard_k">Address</span>
                    <span className="shop_dashboard_v">
                      {myShop.contact?.address || "-"}
                      {myShop.contact?.city
                        ? `, ${myShop.contact.city}`
                        : ""}
                      {myShop.contact?.pincode
                        ? ` - ${myShop.contact.pincode}`
                        : ""}
                    </span>

                    <span className="shop_dashboard_k">Landmark</span>
                    <span className="shop_dashboard_v">
                      {myShop.contact?.landmark || "-"}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="shop_dashboard_subtitle">Status</h4>
                  <div className="shop_dashboard_kv">
                    <span className="shop_dashboard_k">Profile</span>
                    <span className="shop_dashboard_v">
                      {myShop.profileIncomplete ? "Incomplete" : "Complete"}
                    </span>

                    <span className="shop_dashboard_k">Approval</span>
                    <span className="shop_dashboard_v">
                      {myShop.status || "DRAFT"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="shop_dashboard_catalog_summary">
                <div>
                  <strong>
                    Items:{" "}
                    {myShop.catalog?.items
                      ? myShop.catalog.items.length
                      : 0}
                  </strong>
                </div>
                <div>
                  <strong>
                    Services:{" "}
                    {myShop.catalog?.services
                      ? myShop.catalog.services.length
                      : 0}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ====== EXPLORE SECTION ====== */}
      <section className="shop_dashboard_section">
        <div className="shop_dashboard_section_head">
          <h2 className="shop_dashboard_title">Explore</h2>
          <div className="shop_dashboard_tabs">
            <button
              type="button"
              className={
                "shop_dashboard_tab" + (tab === "shops" ? " is-active" : "")
              }
              onClick={() => setTab("shops")}
            >
              Shops
            </button>
            <button
              type="button"
              className={
                "shop_dashboard_tab" +
                (tab === "workers" ? " is-active" : "")
              }
              onClick={() => setTab("workers")}
            >
              Workers
            </button>
          </div>
        </div>

        <div className="shop_dashboard_explore_controls">
          <input
            className="shop_dashboard_search"
            placeholder={
              tab === "shops"
                ? "Search shops by name, city…"
                : "Search workers by name, skill…"
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            className="shop_dashboard_btn shop_dashboard_btn_outline"
            onClick={fetchExplore}
            disabled={loadingExplore}
          >
            {loadingExplore ? "Loading…" : "Search"}
          </button>
        </div>

        {exploreError && (
          <div className="shop_dashboard_error">{exploreError}</div>
        )}

        {/* OTHER SHOPS LIST */}
        {tab === "shops" && (
          <div className="shop_dashboard_grid">
            {loadingExplore && shops.length === 0 && (
              <div className="shop_dashboard_muted">Loading shops…</div>
            )}

            {!loadingExplore && shops.length === 0 && !exploreError && (
              <div className="shop_dashboard_muted">
                No shops found. Try a different search.
              </div>
            )}

            {shops.map((shop) => {
              const photoUrl = getShopPhotoUrl(shop);
              const createdAtLabel = formatCreatedAt(shop.createdAt);
              const hoursSummary = formatHoursSummary(shop.hours);
              const itemsCount = shop.catalog?.items
                ? shop.catalog.items.length
                : 0;
              const servicesCount = shop.catalog?.services
                ? shop.catalog.services.length
                : 0;

              const firstItem =
                shop.catalog?.items && shop.catalog.items.length > 0
                  ? shop.catalog.items[0]
                  : null;

              return (
                <div
                  key={shop.id}
                  className="shop_dashboard_card shop_dashboard_card_small shop_dashboard_card_clickable"
                  onClick={() => openShopModal(shop)}
                >
                  <div className="shop_dashboard_card_head">
                    <div>
                      <h3 className="shop_dashboard_card_title">
                        {shop.basics?.shopName || "Unnamed Shop"}
                      </h3>

                      <div className="shop_dashboard_myshop_owner_line">
                        <span className="shop_dashboard_muted_small">
                          Owner:&nbsp;
                        </span>
                        <span>{shop.name || "—"}</span>
                      </div>

                      <div className="shop_dashboard_chip_row">
                        <div className="shop_dashboard_chip">
                          {shop.basics?.category || "Category"}
                        </div>
                        {shop.status && (
                          <div className="shop_dashboard_chip shop_dashboard_chip_status">
                            {shop.status}
                          </div>
                        )}
                      </div>

                      {shop.basics?.tagline && (
                        <div className="shop_dashboard_tagline">
                          {shop.basics.tagline}
                        </div>
                      )}

                      {createdAtLabel && (
                        <div className="shop_dashboard_muted_small">
                          Since {createdAtLabel}
                        </div>
                      )}
                    </div>

                    {photoUrl && (
                      <img
                        className="shop_dashboard_card_image"
                        src={photoUrl}
                        alt="Shop"
                      />
                    )}
                  </div>

                  <p className="shop_dashboard_card_text">
                    {shop.basics?.about || "No description"}
                  </p>

                  <div className="shop_dashboard_mini_kv">
                    <span>
                      {shop.contact?.address ? `${shop.contact.address}, ` : ""}
                      {shop.contact?.city || "-"}
                      {shop.contact?.pincode
                        ? ` - ${shop.contact.pincode}`
                        : ""}
                    </span>
                    <span>{hoursSummary || "Timings not set"}</span>
                  </div>

                  <div className="shop_dashboard_mini_kv">
                    <span>
                      Items: {itemsCount} • Services: {servicesCount}
                    </span>
                    {firstItem && (
                      <span>
                        Popular item:&nbsp;
                        <strong>
                          {firstItem.name}
                          {firstItem.price
                            ? ` (₹${String(firstItem.price).replace(/`/g, "")})`
                            : ""}
                        </strong>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* WORKERS LIST (unchanged) */}
        {tab === "workers" && (
          <div className="shop_dashboard_grid">
            {loadingExplore && workers.length === 0 && (
              <div className="shop_dashboard_muted">Loading workers…</div>
            )}

            {!loadingExplore && workers.length === 0 && !exploreError && (
              <div className="shop_dashboard_muted">
                No workers found. Try a different search.
              </div>
            )}

            {workers.map((w) => (
              <div
                key={w.id}
                className="shop_dashboard_card shop_dashboard_card_small"
              >
                <div className="shop_dashboard_card_head">
                  <div>
                    <h3 className="shop_dashboard_card_title">
                      {w.name || "Unnamed Worker"}
                    </h3>
                    {w.skills && (
                      <div className="shop_dashboard_chip">
                        {Array.isArray(w.skills)
                          ? w.skills.join(", ")
                          : w.skills}
                      </div>
                    )}
                  </div>
                  {w.profileImage && (
                    <img
                      src={w.profileImage}
                      alt={w.name}
                      className="shop_dashboard_card_image"
                    />
                  )}
                </div>
                <p className="shop_dashboard_card_text">
                  {w.tagline || "Kuch na kuch toh kar hi lenge"}
                </p>
                <div className="shop_dashboard_mini_kv">
                  <span>{w.location || "-"}</span>
                  <span>{w.userType || "Labourer"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ====== SHOP DETAILS MODAL (Explore → shop card click) ====== */}
      {selectedShop && (
        <div
          className="shop_dashboard_modal_overlay"
          onClick={closeShopModal}
        >
          <div
            className="shop_dashboard_modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="shop_dashboard_modal_close"
              onClick={closeShopModal}
            >
              ✕
            </button>

            <div className="shop_dashboard_modal_header">
              <div>
                <h2 className="shop_dashboard_modal_title">
                  {selectedShop.basics?.shopName || "Unnamed Shop"}
                </h2>
                <p className="shop_dashboard_muted_small">
                  Owner: {selectedShop.name || "—"}
                </p>
                <div className="shop_dashboard_chip_row">
                  <div className="shop_dashboard_chip">
                    {selectedShop.basics?.category || "Category"}
                  </div>
                  {selectedShop.status && (
                    <div className="shop_dashboard_chip shop_dashboard_chip_status">
                      {selectedShop.status}
                    </div>
                  )}
                </div>
                {selectedShop.basics?.tagline && (
                  <p className="shop_dashboard_tagline">
                    {selectedShop.basics.tagline}
                  </p>
                )}
              </div>

              {getShopPhotoUrl(selectedShop) && (
                <img
                  className="shop_dashboard_modal_image"
                  src={getShopPhotoUrl(selectedShop)}
                  alt="Shop"
                />
              )}
            </div>

            {/* About */}
            {selectedShop.basics?.about && (
              <div className="shop_dashboard_modal_section">
                <h3 className="shop_dashboard_subtitle">About</h3>
                <p className="shop_dashboard_modal_text">
                  {selectedShop.basics.about}
                </p>
              </div>
            )}

            {/* Address & timings */}
            <div className="shop_dashboard_modal_section">
              <h3 className="shop_dashboard_subtitle">Location & Timings</h3>
              <p className="shop_dashboard_modal_text">
                {selectedShop.contact?.address || "-"}
                {selectedShop.contact?.city
                  ? `, ${selectedShop.contact.city}`
                  : ""}
                {selectedShop.contact?.pincode
                  ? ` - ${selectedShop.contact.pincode}`
                  : ""}
              </p>
              {selectedShop.contact?.landmark && (
                <p className="shop_dashboard_modal_text">
                  Landmark: {selectedShop.contact.landmark}
                </p>
              )}
              <p className="shop_dashboard_modal_text">
                {formatHoursSummary(selectedShop.hours) || "Timings not set"}
              </p>
            </div>

            {/* Contact (masked / reveal) */}
            <div className="shop_dashboard_modal_section">
              <h3 className="shop_dashboard_subtitle">Contact</h3>
              <p className="shop_dashboard_modal_text">
                Phone:&nbsp;
                {contactInfo?.phone
                  ? contactInfo.phone
                  : "Hidden (tap Get Contact)"}
              </p>
              <p className="shop_dashboard_modal_text">
                WhatsApp:&nbsp;
                {contactInfo?.whatsapp
                  ? contactInfo.whatsapp
                  : selectedShop.basics?.whatsapp
                  ? "Hidden (tap Get Contact)"
                  : "Not provided"}
              </p>

              {contactError && (
                <p className="shop_dashboard_error" style={{ marginTop: 6 }}>
                  {contactError}
                </p>
              )}

              <button
                type="button"
                className="shop_dashboard_btn shop_dashboard_btn_primary"
                onClick={handleGetContact}
                disabled={contactLoading}
              >
                {contactLoading ? "Getting contact…" : "Get Contact (₹15)"}
              </button>
            </div>

            {/* Items */}
            <div className="shop_dashboard_modal_section">
              <h3 className="shop_dashboard_subtitle">Items</h3>
              {selectedShop.catalog?.items &&
              selectedShop.catalog.items.length > 0 ? (
                <ul className="shop_dashboard_list">
                  {selectedShop.catalog.items.map((item, idx) => (
                    <li key={idx} className="shop_dashboard_list_item">
                      <span>{item.name}</span>
                      <span>
                        {item.price
                          ? `₹${String(item.price).replace(/`/g, "")}`
                          : "Price not set"}
                        {item.unit ? ` / ${item.unit}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="shop_dashboard_muted_small">
                  No items added yet.
                </p>
              )}
            </div>

            {/* Services */}
            <div className="shop_dashboard_modal_section">
              <h3 className="shop_dashboard_subtitle">Services</h3>
              {selectedShop.catalog?.services &&
              selectedShop.catalog.services.length > 0 ? (
                <ul className="shop_dashboard_list">
                  {selectedShop.catalog.services.map((svc, idx) => (
                    <li key={idx} className="shop_dashboard_list_item">
                      <span>{svc.name || "Service"}</span>
                      <span>
                        {svc.price
                          ? `₹${String(svc.price).replace(/`/g, "")}`
                          : "Price not set"}
                        {svc.unit ? ` / ${svc.unit}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="shop_dashboard_muted_small">
                  No services added yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
