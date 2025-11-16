import React, { useEffect, useMemo, useState } from "react";
import "./Shop.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SHOP_TYPES = ["General Store", "Hardware", "Electronics", "Restaurant", "Salon", "Tailor", "Other"];

const emptyShop = {
  id: "",
  ownerId: "",
  name: "",
  ownerName: "",
  contact: "",
  address: "",
  type: "",
  imageUrl: "",                 // NEW: main display image
  items: [],                    // Now supports [{name, price}]
  services: [],                 // Now supports [{name, price}]
  jobPostings: [],
  walletBalance: 0,
  transactions: [],
  openingTime: "09:00",
  closingTime: "18:00",
  openDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  reviews: [],                  // NEW: [{user, rating(1-5), text, atISO}]
  rating: 0,                    // NEW: avg rating (optional precomputed)
};

export default function Shop({
  currentUserId = "demo-user-1",
  initialShops,
  myShopFromServer,
}) {
  // ---- Demo data (replace with API data) ----
  const demoMyShop = {
    ...emptyShop,
    id: "shop-001",
    ownerId: "demo-user-1",
    name: "Sharma Hardware",
    ownerName: "Rakesh Sharma",
    contact: "9876543210",
    address: "Main Bazaar, Rohtak",
    type: "Hardware",
    imageUrl: "https://images.unsplash.com/photo-1589733924641-221cfb41f0b4?q=80&w=1200&auto=format&fit=crop",
    items: [{ name: "Cement (per bag)", price: 380 }, { name: "Bricks (100 pcs)", price: 750 }],
    services: [{ name: "Local Delivery", price: 80 }],
    walletBalance: 320.0,
    openingTime: "09:30",
    closingTime: "19:00",
    openDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    reviews: [
      { user: "Vijay", rating: 5, text: "Achhi quality aur time par delivery.", at: "2025-09-12T09:21:00Z" },
      { user: "Kamal", rating: 4, text: "Rates theek hain, staff helpful.", at: "2025-10-03T14:05:00Z" },
    ],
    rating: 4.5,
  };

  const demoShops = [
    demoMyShop,
    {
      ...emptyShop,
      id: "shop-002",
      ownerId: "demo-user-2",
      name: "Balaji Tailors",
      ownerName: "Sunita",
      contact: "9800000011",
      address: "Sector 6, Rohtak",
      type: "Tailor",
      imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop",
      services: [{ name: "Stitching (per piece)", price: 250 }, { name: "Alteration", price: 120 }],
      openingTime: "10:00",
      closingTime: "20:00",
      openDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      reviews: [{ user: "Pooja", rating: 5, text: "Fitting bahut acchi aayi!", at: "2025-08-19T08:10:00Z" }],
      rating: 5,
    },
    {
      ...emptyShop,
      id: "shop-003",
      ownerId: "demo-user-3",
      name: "Kumar Electronics",
      ownerName: "Vijay",
      contact: "9800000022",
      address: "Jhajjar Road",
      type: "Electronics",
      imageUrl: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
      items: [{ name: "LED Bulb", price: 120 }, { name: "Ceiling Fan", price: 1499 }],
      services: [{ name: "Repair Visit", price: 199 }],
      reviews: [{ user: "Rahul", rating: 4, text: "Quick service.", at: "2025-07-02T12:22:00Z" }],
      rating: 4,
    },
  ];

  const [shops, setShops] = useState(initialShops || demoShops);
  const [myShop, setMyShop] = useState(myShopFromServer || demoMyShop);
  const [query, setQuery] = useState("");

  // Edit modal state (only for own shop)
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState(myShop || emptyShop);
  const [tagInput, setTagInput] = useState("");

  // Public preview modal for own shop
  const [previewOpen, setPreviewOpen] = useState(false);

  // NEW: Modal for any shop (click card)
  const [selectedShop, setSelectedShop] = useState(null);
  const [shopModalOpen, setShopModalOpen] = useState(false);

  useEffect(() => {
    if (myShopFromServer) setMyShop(myShopFromServer);
    if (initialShops) setShops(initialShops);
  }, [myShopFromServer, initialShops]);

  // Partition: my shop vs others
  const otherShops = useMemo(
    () => (shops || []).filter((s) => s?.ownerId !== (myShop?.ownerId || currentUserId)),
    [shops, myShop, currentUserId]
  );

  const filteredOthers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return otherShops;
    return otherShops.filter((s) =>
      [s.name, s.ownerName, s.type, s.address].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [otherShops, query]);

  // ---------- UI Handlers (own shop) ----------
  function startEditOwn() {
    setDraft(JSON.parse(JSON.stringify(myShop || emptyShop)));
    setEditOpen(true);
  }

  function toggleDay(day) {
    setDraft((d) => {
      const set = new Set(d.openDays || []);
      set.has(day) ? set.delete(day) : set.add(day);
      return { ...d, openDays: Array.from(set) };
    });
  }

  function addTag(kind) {
    const value = tagInput.trim();
    if (!value) return;
    setDraft((d) => {
      const arr = Array.from(new Set([...(d[kind] || []), value]));
      return { ...d, [kind]: arr };
    });
    setTagInput("");
  }
  function removeTag(kind, value) {
    setDraft((d) => ({ ...d, [kind]: (d[kind] || []).filter((x) => x !== value) }));
  }

  async function submitOwnShop(e) {
    e.preventDefault();
    if (!draft.name || !draft.ownerName || !draft.contact) return alert("Name, Owner and Contact are required.");
    // TODO: API update
    setMyShop(draft);
    setShops((list) => list.map((s) => (s.id === draft.id ? draft : s)));
    setEditOpen(false);
  }

  // Wallet demo actions
  function addCreditToMy(amount) {
    setMyShop((s) => {
      const walletBalance = Number(s.walletBalance || 0) + Number(amount);
      const tx = { id: crypto.randomUUID(), type: "credit", amount: Number(amount), at: new Date().toISOString() };
      const updated = { ...s, walletBalance, transactions: [tx, ...(s.transactions || [])] };
      setShops((list) => list.map((it) => (it.id === s.id ? updated : it)));
      return updated;
    });
  }
  function addDebitToMy(amount) {
    setMyShop((s) => {
      const walletBalance = Math.max(0, Number(s.walletBalance || 0) - Number(amount));
      const tx = { id: crypto.randomUUID(), type: "debit", amount: Number(amount), at: new Date().toISOString() };
      const updated = { ...s, walletBalance, transactions: [tx, ...(s.transactions || [])] };
      setShops((list) => list.map((it) => (it.id === s.id ? updated : it)));
      return updated;
    });
  }

  // ---------- Reusable card ----------
  function ShopCard({ s, isOwn = false, showWalletActions = false }) {
    return (
      <div
        className="shop_card"
        onClick={() => {
          setSelectedShop(s);
          setShopModalOpen(true);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setSelectedShop(s);
            setShopModalOpen(true);
          }
        }}
      >
        {s.imageUrl && (
          <div className="shop_img_wrap">
            <img className="shop_img" src={s.imageUrl} alt={s.name || "Shop"} />
          </div>
        )}

        <div className="shop_card_head">
          <h3 className="shop_card_title">
            {s.name || "-"} {isOwn && <span style={{ fontSize: 12, color: "#16a34a" }}>(Your Shop)</span>}
          </h3>
          <span className="shop_tag">{s.type || "Uncategorized"}</span>
        </div>

        <div className="shop_row">
          <span className="shop_label">Owner:</span> <span>{s.ownerName || "-"}</span>
        </div>
        <div className="shop_row">
          <span className="shop_label">Contact:</span> <span>{s.contact || "-"}</span>
        </div>
        <div className="shop_row">
          <span className="shop_label">Address:</span> <span>{s.address || "-"}</span>
        </div>

        {(s.items?.length || s.services?.length) ? (
          <div className="shop_pills">
            {(s.items || []).slice(0, 3).map((v) => (
              <span className="shop_pill" key={`i-${v.name || v}`}>{v.name || v}</span>
            ))}
            {(s.services || []).slice(0, 3).map((v) => (
              <span className="shop_pill shop_pill_alt" key={`s-${v.name || v}`}>{v.name || v}</span>
            ))}
          </div>
        ) : null}

        <div className="shop_hours">
          <span className="shop_label">Hours:</span>
          <span>{s.openingTime} - {s.closingTime}</span>
          <span className="shop_divider">•</span>
          <span>{(s.openDays || []).join(", ")}</span>
        </div>

        <div className="shop_wallet">
          <div>
            <span className="shop_label">Wallet:</span> ₹{Number(s.walletBalance || 0).toFixed(2)}{" "}
            {typeof s.rating === "number" && s.rating > 0 && (
              <span className="shop_rating">★ {s.rating.toFixed(1)}</span>
            )}
          </div>
          {showWalletActions && (
            <div className="shop_wallet_actions" onClick={(e) => e.stopPropagation()}>
              <button className="shop_btn shop_btn_sm" onClick={() => addCreditToMy(50)}>+ ₹50</button>
              <button className="shop_btn shop_btn_sm shop_btn_warn" onClick={() => addDebitToMy(50)}>- ₹50</button>
            </div>
          )}
        </div>

        <div className="shop_card_footer" onClick={(e) => e.stopPropagation()}>
          {isOwn ? (
            <>
              <button className="shop_btn" onClick={startEditOwn}>Edit</button>
              <button className="shop_btn" onClick={() => setPreviewOpen(true)}>Public Preview</button>
            </>
          ) : (
            <a className="shop_btn" href={`/shops/${s.id}`} onClick={(e) => e.stopPropagation()}>View</a>
          )}
        </div>
      </div>
    );
  }

  // ---------- Modal to show any shop full details ----------
  function ShopDetailsModal({ shop, onClose }) {
    if (!shop) return null;
    return (
      <div className="shop_modal_backdrop" onClick={onClose}>
        <div className="shop_modal shop_modal_wide" onClick={(e) => e.stopPropagation()}>
          <div className="shop_modal_header">
            <h3 className="shop_modal_title">{shop.name}</h3>
            <button className="shop_btn shop_btn_sm" onClick={onClose}>Close</button>
          </div>

          <div className="shop_modal_body">
            {shop.imageUrl && (
              <div className="shop_modal_image">
                <img src={shop.imageUrl} alt={shop.name} />
              </div>
            )}

            <div className="shop_modal_info">
              <div className="shop_row"><span className="shop_label">Owner:</span> <span>{shop.ownerName}</span></div>
              <div className="shop_row"><span className="shop_label">Contact:</span> <span>{shop.contact}</span></div>
              <div className="shop_row"><span className="shop_label">Address:</span> <span>{shop.address}</span></div>
              <div className="shop_row">
                <span className="shop_label">Hours:</span>
                <span>{shop.openingTime} - {shop.closingTime} • {(shop.openDays || []).join(", ")}</span>
              </div>
              {typeof shop.rating === "number" && shop.rating > 0 && (
                <div className="shop_row"><span className="shop_label">Rating:</span> <span>★ {shop.rating.toFixed(1)}</span></div>
              )}

              {(shop.items?.length || shop.services?.length) ? (
                <div className="shop_modal_lists">
                  {shop.items?.length > 0 && (
                    <div className="shop_list_block">
                      <h4 className="shop_list_title">Items</h4>
                      <ul className="shop_list">
                        {shop.items.map((it, idx) => (
                          <li key={`it-${idx}`} className="shop_list_row">
                            <span>{it.name || it}</span>
                            {typeof it.price !== "undefined" && <span className="shop_price">₹{Number(it.price).toFixed(0)}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {shop.services?.length > 0 && (
                    <div className="shop_list_block">
                      <h4 className="shop_list_title">Services</h4>
                      <ul className="shop_list">
                        {shop.services.map((sv, idx) => (
                          <li key={`sv-${idx}`} className="shop_list_row">
                            <span>{sv.name || sv}</span>
                            {typeof sv.price !== "undefined" && <span className="shop_price">₹{Number(sv.price).toFixed(0)}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}

              <div className="shop_reviews_block">
                <h4 className="shop_list_title">Reviews</h4>
                {shop.reviews?.length ? (
                  <ul className="shop_reviews">
                    {shop.reviews.map((r, idx) => (
                      <li key={`rv-${idx}`} className="shop_review_row">
                        <div className="shop_review_head">
                          <span className="shop_review_user">{r.user}</span>
                          <span className="shop_review_rating">★ {Number(r.rating).toFixed(1)}</span>
                          {r.at && <span className="shop_review_date">{new Date(r.at).toLocaleDateString()}</span>}
                        </div>
                        {r.text && <div className="shop_review_text">{r.text}</div>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="shop_empty">No reviews yet.</div>
                )}
              </div>
            </div>
          </div>

          <div className="shop_modal_actions">
            <a className="shop_btn shop_btn_primary" href={`/shops/${shop.id}`}>Go to Shop Page</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shop_page">
      {/* My Shop */}
      <div className="shop_page_head">
        <h2 className="shop_title">My Shop</h2>
      </div>
      {myShop ? (
        <ShopCard s={myShop} isOwn showWalletActions />
      ) : (
        <div className="shop_empty">You don’t have a shop yet. (It will be created automatically at signup.)</div>
      )}

      {/* Others */}
      <div className="shop_page_head" style={{ marginTop: 24 }}>
        <h2 className="shop_title">Other Shops</h2>
        <div className="shop_actions">
          <input
            className="shop_input"
            placeholder="Search by name, owner, type, address…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="shop_grid">
        {filteredOthers.map((s) => (
          <ShopCard key={s.id} s={s} />
        ))}
        {filteredOthers.length === 0 && <div className="shop_empty">No shops found.</div>}
      </div>

      {/* Edit Own Shop Modal */}
      {editOpen && (
        <div className="shop_modal_backdrop" onClick={() => setEditOpen(false)}>
          <div className="shop_modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="shop_modal_title">Edit Shop</h3>
            <form className="shop_form" onSubmit={submitOwnShop}>
              <div className="shop_form_grid">
                <label className="shop_field">
                  <span className="shop_label">Shop Name</span>
                  <input className="shop_input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required />
                </label>

                <label className="shop_field">
                  <span className="shop_label">Owner Name</span>
                  <input className="shop_input" value={draft.ownerName} onChange={(e) => setDraft({ ...draft, ownerName: e.target.value })} required />
                </label>

                <label className="shop_field">
                  <span className="shop_label">Contact</span>
                  <input className="shop_input" value={draft.contact} onChange={(e) => setDraft({ ...draft, contact: e.target.value })} required />
                </label>

                <label className="shop_field shop_field_col2">
                  <span className="shop_label">Address</span>
                  <input className="shop_input" value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} />
                </label>

                <label className="shop_field">
                  <span className="shop_label">Type</span>
                  <select className="shop_input" value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })}>
                    <option value="">Select type</option>
                    {SHOP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </label>

                <label className="shop_field">
                  <span className="shop_label">Opening</span>
                  <input type="time" className="shop_input" value={draft.openingTime} onChange={(e) => setDraft({ ...draft, openingTime: e.target.value })} />
                </label>

                <label className="shop_field">
                  <span className="shop_label">Closing</span>
                  <input type="time" className="shop_input" value={draft.closingTime} onChange={(e) => setDraft({ ...draft, closingTime: e.target.value })} />
                </label>

                <div className="shop_field shop_days">
                  <span className="shop_label">Open Days</span>
                  <div className="shop_days_pills">
                    {DAYS.map((d) => (
                      <button
                        type="button"
                        key={d}
                        className={`shop_pill ${draft.openDays?.includes(d) ? "shop_pill_active" : ""}`}
                        onClick={() => toggleDay(d)}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="shop_field shop_field_col2">
                  <span className="shop_label">Items & Services</span>
                  <div className="shop_tag_row">
                    <input
                      className="shop_input"
                      placeholder="e.g., Cement / Haircut"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                    />
                    <button type="button" className="shop_btn shop_btn_sm" onClick={() => addTag("items")}>+ Item</button>
                    <button type="button" className="shop_btn shop_btn_sm" onClick={() => addTag("services")}>+ Service</button>
                  </div>
                  <div className="shop_pills_wrap">
                    {(draft.items || []).map((v, idx) => (
                      <span key={`i-${idx}`} className="shop_pill">
                        {typeof v === "string" ? v : v.name}
                        <button type="button" className="shop_pill_x" onClick={() => removeTag("items", v)}>×</button>
                      </span>
                    ))}
                    {(draft.services || []).map((v, idx) => (
                      <span key={`s-${idx}`} className="shop_pill shop_pill_alt">
                        {typeof v === "string" ? v : v.name}
                        <button type="button" className="shop_pill_x" onClick={() => removeTag("services", v)}>×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="shop_modal_actions">
                <button type="button" className="shop_btn" onClick={() => setEditOpen(false)}>Cancel</button>
                <button type="submit" className="shop_btn shop_btn_primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Public Preview Modal (own shop) */}
      {previewOpen && myShop && (
        <div className="shop_modal_backdrop" onClick={() => setPreviewOpen(false)}>
          <div className="shop_modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="shop_modal_title">Public Preview</h3>
            <ShopCard s={myShop} isOwn={false} showWalletActions={false} />
            <div className="shop_modal_actions">
              <button type="button" className="shop_btn" onClick={() => setPreviewOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Any shop full details modal */}
      {shopModalOpen && (
        <ShopDetailsModal
          shop={selectedShop}
          onClose={() => {
            setShopModalOpen(false);
            setSelectedShop(null);
          }}
        />
      )}
    </div>
  );
}
