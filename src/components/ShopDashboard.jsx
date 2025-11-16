// // ShopDashboard.jsx
// import React, { useEffect, useState } from "react";
// import axiosInstance from "../axiosConfig";
// import "./ShopDashboard.css"; // optional, you can style later

// export default function ShopDashboard() {
//     const [myShop, setMyShop] = useState(null);
//     const [loadingMyShop, setLoadingMyShop] = useState(true);
//     const [myShopError, setMyShopError] = useState("");

//     const [tab, setTab] = useState("shops"); // "shops" | "workers"
//     const [search, setSearch] = useState("");
//     const [shops, setShops] = useState([]);
//     const [workers, setWorkers] = useState([]);
//     const [loadingExplore, setLoadingExplore] = useState(false);
//     const [exploreError, setExploreError] = useState("");

//     // ====== FETCH OWN SHOP ======
//     useEffect(() => {
//         async function fetchMyShop() {
//             setLoadingMyShop(true);
//             setMyShopError("");
//             try {
//                 const res = await axiosInstance.get("/api/users/protected/shops/me");
//                 setMyShop(res.data.shop || null);
//             } catch (err) {
//                 console.error("fetchMyShop error:", err);
//                 setMyShopError(
//                     err?.response?.data?.error || "Failed to load your shop profile"
//                 );
//             } finally {
//                 setLoadingMyShop(false);
//             }
//         }
//         fetchMyShop();
//     }, []);

//     // ====== FETCH OTHER SHOPS / WORKERS ======
//     async function fetchExplore() {
//         setLoadingExplore(true);
//         setExploreError("");
//         try {
//             if (tab === "shops") {
//                 const res = await axiosInstance.get("/api/users/protected/shops", {
//                     params: { search: search || undefined },
//                 });
//                 setShops(res.data.shops || []);
//             } else {
//                 const res = await axiosInstance.post("/api/users/protected/workers", {
//                     params: { search: search || undefined },
//                 });
//                 setWorkers(res.data.workers || []);
//             }
//         } catch (err) {
//             console.error("fetchExplore error:", err);
//             setExploreError(
//                 err?.response?.data?.error ||
//                 `Failed to load ${tab === "shops" ? "shops" : "workers"}`
//             );
//         } finally {
//             setLoadingExplore(false);
//         }
//     }

//     useEffect(() => {
//         // initial load for default tab
//         fetchExplore();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [tab]);

//     // small helpers
//     const getShopPhotoUrl = (shop) =>
//         shop?.photoUrl ||
//         shop?.photos?.imageUrl ||
//         shop?.photos?.logoUrl ||
//         "";

//     return (
//         <div className="shop_dashboard_page">
//             {/* ====== OWN SHOP SECTION ====== */}
//             <section className="shop_dashboard_section">
//                 <div className="shop_dashboard_section_head">
//                     <h2 className="shop_dashboard_title">My Shop</h2>
//                     <a
//                         href="/complete-shop-profile"
//                         className="shop_dashboard_btn shop_dashboard_btn_primary"
//                     >
//                         Edit Profile
//                     </a>
//                 </div>

//                 {loadingMyShop && (
//                     <div className="shop_dashboard_muted">Loading your shop…</div>
//                 )}

//                 {myShopError && (
//                     <div className="shop_dashboard_error">{myShopError}</div>
//                 )}

//                 {!loadingMyShop && !myShop && !myShopError && (
//                     <div className="shop_dashboard_muted">
//                         You have not created your shop profile yet.
//                         <br />
//                         <a
//                             href="/complete-shop-profile"
//                             className="shop_dashboard_btn shop_dashboard_btn_outline"
//                         >
//                             Create Shop Profile
//                         </a>
//                     </div>
//                 )}

//                 {myShop && (
//                     <div className="shop_dashboard_card shop_dashboard_myshop">
//                         <div className="shop_dashboard_myshop_main">
//                             <div className="shop_dashboard_myshop_header">
//                                 <div>
//                                     <h3 className="shop_dashboard_myshop_name">
//                                         {myShop.basics?.shopName || "Unnamed Shop"}
//                                     </h3>
//                                     <div className="shop_dashboard_chip">
//                                         {myShop.basics?.category || "Category not set"}
//                                     </div>
//                                     {myShop.basics?.tagline && (
//                                         <div className="shop_dashboard_tagline">
//                                             {myShop.basics.tagline}
//                                         </div>
//                                     )}
//                                 </div>
//                                 {getShopPhotoUrl(myShop) && (
//                                     <img
//                                         className="shop_dashboard_myshop_image"
//                                         src={getShopPhotoUrl(myShop)}
//                                         alt="Shop"
//                                     />
//                                 )}
//                             </div>

//                             <p className="shop_dashboard_about">
//                                 {myShop.basics?.about || "No description added yet."}
//                             </p>

//                             <div className="shop_dashboard_two_col">
//                                 <div>
//                                     <h4 className="shop_dashboard_subtitle">Contact</h4>
//                                     <div className="shop_dashboard_kv">
//                                         <span className="shop_dashboard_k">WhatsApp</span>
//                                         <span className="shop_dashboard_v">
//                                             {myShop.basics?.whatsapp || "Not set"}
//                                         </span>

//                                         <span className="shop_dashboard_k">Address</span>
//                                         <span className="shop_dashboard_v">
//                                             {myShop.contact?.address || "-"}
//                                             {myShop.contact?.city
//                                                 ? `, ${myShop.contact.city}`
//                                                 : ""}
//                                             {myShop.contact?.pincode
//                                                 ? ` - ${myShop.contact.pincode}`
//                                                 : ""}
//                                         </span>

//                                         <span className="shop_dashboard_k">Landmark</span>
//                                         <span className="shop_dashboard_v">
//                                             {myShop.contact?.landmark || "-"}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <h4 className="shop_dashboard_subtitle">Status</h4>
//                                     <div className="shop_dashboard_kv">
//                                         <span className="shop_dashboard_k">Profile</span>
//                                         <span className="shop_dashboard_v">
//                                             {myShop.profileIncomplete
//                                                 ? "Incomplete"
//                                                 : "Complete"}
//                                         </span>

//                                         <span className="shop_dashboard_k">Approval</span>
//                                         <span className="shop_dashboard_v">
//                                             {myShop.status || "DRAFT"}
//                                         </span>
//                                     </div>

//                                     <h4 className="shop_dashboard_subtitle">
//                                         Opening Hours (short)
//                                     </h4>
//                                     <div className="shop_dashboard_hours_list">
//                                         {(myShop.hours || []).slice(0, 3).map((h) => (
//                                             <div
//                                                 key={h.day}
//                                                 className="shop_dashboard_hours_row"
//                                             >
//                                                 <span className="shop_dashboard_hours_day">
//                                                     {h.day}
//                                                 </span>
//                                                 <span className="shop_dashboard_hours_time">
//                                                     {h.open ? `${h.from} - ${h.to}` : "Closed"}
//                                                 </span>
//                                             </div>
//                                         ))}
//                                         {myShop.hours && myShop.hours.length > 3 && (
//                                             <div className="shop_dashboard_muted">
//                                                 + {myShop.hours.length - 3} more days
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="shop_dashboard_catalog_summary">
//                                 <div>
//                                     <strong>
//                                         Items:{" "}
//                                         {myShop.catalog?.items
//                                             ? myShop.catalog.items.length
//                                             : 0}
//                                     </strong>
//                                 </div>
//                                 <div>
//                                     <strong>
//                                         Services:{" "}
//                                         {myShop.catalog?.services
//                                             ? myShop.catalog.services.length
//                                             : 0}
//                                     </strong>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </section>

//             {/* ====== EXPLORE SECTION ====== */}
//             <section className="shop_dashboard_section">
//                 <div className="shop_dashboard_section_head">
//                     <h2 className="shop_dashboard_title">Explore</h2>
//                     <div className="shop_dashboard_tabs">
//                         <button
//                             type="button"
//                             className={
//                                 "shop_dashboard_tab" +
//                                 (tab === "shops" ? " is-active" : "")
//                             }
//                             onClick={() => setTab("shops")}
//                         >
//                             Shops
//                         </button>
//                         <button
//                             type="button"
//                             className={
//                                 "shop_dashboard_tab" +
//                                 (tab === "workers" ? " is-active" : "")
//                             }
//                             onClick={() => setTab("workers")}
//                         >
//                             Workers
//                         </button>
//                     </div>
//                 </div>

//                 <div className="shop_dashboard_explore_controls">
//                     <input
//                         className="shop_dashboard_search"
//                         placeholder={
//                             tab === "shops"
//                                 ? "Search shops by name, city…"
//                                 : "Search workers by name, skill…"
//                         }
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                     />
//                     <button
//                         type="button"
//                         className="shop_dashboard_btn shop_dashboard_btn_outline"
//                         onClick={fetchExplore}
//                         disabled={loadingExplore}
//                     >
//                         {loadingExplore ? "Loading…" : "Search"}
//                     </button>
//                 </div>

//                 {exploreError && (
//                     <div className="shop_dashboard_error">{exploreError}</div>
//                 )}

//                 {/* OTHER SHOPS LIST */}
//                 {tab === "shops" && (
//                     <div className="shop_dashboard_grid">
//                         {loadingExplore && shops.length === 0 && (
//                             <div className="shop_dashboard_muted">
//                                 Loading shops…
//                             </div>
//                         )}

//                         {!loadingExplore && shops.length === 0 && !exploreError && (
//                             <div className="shop_dashboard_muted">
//                                 No shops found. Try a different search.
//                             </div>
//                         )}

//                         {shops.map((shop) => (
//                             <div
//                                 key={shop.id}
//                                 className="shop_dashboard_card shop_dashboard_card_small"
//                             >
//                                 <div className="shop_dashboard_card_head">
//                                     <div>
//                                         <h3 className="shop_dashboard_card_title">
//                                             {shop.basics?.shopName || "Unnamed Shop"}
//                                         </h3>
//                                         <div className="shop_dashboard_chip">
//                                             {shop.basics?.category || "Category"}
//                                         </div>
//                                     </div>
//                                     {getShopPhotoUrl(shop) && (
//                                         <img
//                                             className="shop_dashboard_card_image"
//                                             src={getShopPhotoUrl(shop)}
//                                             alt="Shop"
//                                         />
//                                     )}
//                                 </div>
//                                 <p className="shop_dashboard_card_text">
//                                     {shop.basics?.about || "No description"}
//                                 </p>
//                                 <div className="shop_dashboard_mini_kv">
//                                     <span>
//                                         {shop.contact?.city || "-"},{" "}
//                                         {shop.contact?.pincode || ""}
//                                     </span>
//                                     <span>
//                                         Items:{" "}
//                                         {shop.catalog?.items
//                                             ? shop.catalog.items.length
//                                             : 0}
//                                         {" · "}
//                                         Services:{" "}
//                                         {shop.catalog?.services
//                                             ? shop.catalog.services.length
//                                             : 0}
//                                     </span>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 {/* WORKERS LIST */}
//                 {tab === "workers" && (
//                     <div className="shop_dashboard_grid">
//                         {loadingExplore && workers.length === 0 && (
//                             <div className="shop_dashboard_muted">
//                                 Loading workers…
//                             </div>
//                         )}

//                         {!loadingExplore &&
//                             workers.length === 0 &&
//                             !exploreError && (
//                                 <div className="shop_dashboard_muted">
//                                     No workers found. Try a different search.
//                                 </div>
//                             )}

//                         {/* {workers.map((w) => (
//               <div
//                 key={w.id}
//                 className="shop_dashboard_card shop_dashboard_card_small"
//               >
//                 <div className="shop_dashboard_card_head">
//                   <div>
//                     <h3 className="shop_dashboard_card_title">
//                       {w.name || "Unnamed Worker"}
//                     </h3>
//                     {w.skill && (
//                       <div className="shop_dashboard_chip">
//                         {w.skill}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <p className="shop_dashboard_card_text">
//                   {w.about || w.experience || "No description"}
//                 </p>
//                 <div className="shop_dashboard_mini_kv">
//                   <span>{w.city || "-"}</span>
//                   <span>Phone: {w.phone || "–"}</span>
//                 </div>
//               </div>
//             ))} */}
//                         {workers.map((w) => (
//                             <div key={w.id} className="shop_dashboard_card shop_dashboard_card_small">
//                                 <div className="shop_dashboard_card_head">
//                                     <div>
//                                         <h3 className="shop_dashboard_card_title">
//                                             {w.name || "Unnamed Worker"}
//                                         </h3>
//                                         {w.skills && (
//                                             <div className="shop_dashboard_chip">
//                                                 {Array.isArray(w.skills) ? w.skills.join(", ") : w.skills}
//                                             </div>
//                                         )}
//                                     </div>
//                                     {w.profileImage && (
//                                         <img
//                                             src={w.profileImage}
//                                             alt={w.name}
//                                             className="shop_dashboard_card_image"
//                                         />
//                                     )}
//                                 </div>
//                                 <p className="shop_dashboard_card_text">
//                                     {w.tagline || "Kuch na kuch toh kar hi lenge"}
//                                 </p>
//                                 <div className="shop_dashboard_mini_kv">
//                                     <span>{w.location || "-"}</span>
//                                     <span>{w.userType || "Labourer"}</span>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </section>
//         </div>
//     );
// }


// ShopDashboard.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import "./ShopDashboard.css";

export default function ShopDashboard() {
  const [myShop, setMyShop] = useState(null);
  const [loadingMyShop, setLoadingMyShop] = useState(true);
  const [myShopError, setMyShopError] = useState("");

  const [tab, setTab] = useState("shops"); // "shops" | "workers"
  const [search, setSearch] = useState("");
  const [shops, setShops] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loadingExplore, setLoadingExplore] = useState(false);
  const [exploreError, setExploreError] = useState("");

  // ====== FETCH OWN SHOP ======
  useEffect(() => {
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
  }, []);

  // ====== FETCH OTHER SHOPS / WORKERS ======
  async function fetchExplore() {
    setLoadingExplore(true);
    setExploreError("");

    try {
      if (tab === "shops") {
        // GET list of shops
        const res = await axiosInstance.get("/api/users/protected/shops", {
          params: { search: search || undefined },
        });
        setShops(res.data.shops || []);
      } else {
        // WORKERS: use POST /protected/search-profiles
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
    // reload when tab changes
    fetchExplore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const getShopPhotoUrl = (shop) =>
    shop?.photoUrl ||
    shop?.photos?.imageUrl ||
    shop?.photos?.logoUrl ||
    "";

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
                "shop_dashboard_tab" + (tab === "workers" ? " is-active" : "")
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

            {shops.map((shop) => (
              <div
                key={shop.id}
                className="shop_dashboard_card shop_dashboard_card_small"
              >
                <div className="shop_dashboard_card_head">
                  <div>
                    <h3 className="shop_dashboard_card_title">
                      {shop.basics?.shopName || "Unnamed Shop"}
                    </h3>
                    <div className="shop_dashboard_chip">
                      {shop.basics?.category || "Category"}
                    </div>
                  </div>
                  {getShopPhotoUrl(shop) && (
                    <img
                      className="shop_dashboard_card_image"
                      src={getShopPhotoUrl(shop)}
                      alt="Shop"
                    />
                  )}
                </div>
                <p className="shop_dashboard_card_text">
                  {shop.basics?.about || "No description"}
                </p>
                <div className="shop_dashboard_mini_kv">
                  <span>
                    {shop.contact?.city || "-"},{" "}
                    {shop.contact?.pincode || ""}
                  </span>
                  <span>
                    Items:{" "}
                    {shop.catalog?.items
                      ? shop.catalog.items.length
                      : 0}
                    {" · "}
                    Services:{" "}
                    {shop.catalog?.services
                      ? shop.catalog.services.length
                      : 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* WORKERS LIST */}
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
    </div>
  );
}
