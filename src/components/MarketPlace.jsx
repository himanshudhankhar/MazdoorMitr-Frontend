import React, { useMemo, useState } from "react";
import "./Marketplace.css";
import axiosInstance from "../axiosConfig"; // <-- import axios instance

const TABS = ["Jobs", "Buy Requests", "Service Requests"];

export default function Marketplace() {
  const [tab, setTab] = useState(TABS[0]);
  const [q, setQ] = useState("");

  // View details + apply/quote modal
  const [selected, setSelected] = useState(null); // { type, data }

  // Application / quote form state (no name field)
  const [appExpectedPrice, setAppExpectedPrice] = useState("");
  const [appMessage, setAppMessage] = useState("");

  // Post modal state
  const [postModalType, setPostModalType] = useState(null); // "Jobs" | "Buy Requests" | "Service Requests" | null
  const [postTitle, setPostTitle] = useState("");
  const [postShopName, setPostShopName] = useState("");
  const [postQty, setPostQty] = useState("");
  const [postPrice, setPostPrice] = useState("");
  const [postLocation, setPostLocation] = useState("");
  const [postNotes, setPostNotes] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const [jobs, setJobs] = useState([
    {
      id: "J001",
      title: "Helper for Hardware Shop",
      shopName: "Sharma Hardware",
      wage: 700,
      location: "Rohini, Delhi",
      desc: "Unload material, arrange inventory, basic billing during rush hours. 10am–8pm."
    },
    {
      id: "J002",
      title: "Delivery Boy (Scooty)",
      shopName: "Daily Needs Mart",
      wage: 900,
      location: "Gurugram, Sector 56",
      desc: "Local deliveries within 5 km. Petrol allowance provided. Aadhar required."
    },
    {
      id: "J003",
      title: "Mason (Civil)",
      shopName: "Raj Constructions",
      wage: 1200,
      location: "Dwarka, Delhi",
      desc: "Brickwork and plastering for a residential site. Safety gear provided."
    },
    {
      id: "J004",
      title: "Painter",
      shopName: "ColorKart",
      wage: 1000,
      location: "Noida, Sector 62",
      desc: "Tools available on site."
    },
    {
      id: "J005",
      title: "Carpenter (Modular)",
      shopName: "WoodCraft",
      wage: 1500,
      location: "Faridabad, NIT 5",
      desc: "Install modular kitchen cabinets and wardrobe fittings."
    },
    {
      id: "J006",
      title: "Warehouse Packer",
      shopName: "QuickShip Logistics",
      wage: 800,
      location: "Okhla Phase II, Delhi",
      desc: "Packing online orders, labeling, and loading. Day shift."
    },
    {
      id: "J007",
      title: "Electrician Helper",
      shopName: "Neo Electric Works",
      wage: 900,
      location: "Karol Bagh, Delhi",
      desc: "Assist senior electrician in wiring and fixture installation."
    },
    {
      id: "J008",
      title: "Cook (North Indian)",
      shopName: "Tasty Tiffins",
      wage: 1100,
      location: "Saket, Delhi",
      desc: "Prepare rotis, dal, sabzi for 60 meals. Morning shift 6am–1pm."
    }
  ]);

  const [buyReqs, setBuyReqs] = useState([
    {
      id: "B001",
      item: "Cement (Ultratech/ACC)",
      qty: "100 bags",
      price: 350,
      location: "Najafgarh, Delhi",
      notes: "Need within 2 days. Unloading required. Quote inclusive of GST."
    },
    {
      id: "B002",
      item: "Mild Steel Rods 12mm",
      qty: "1.5 tons",
      price: 52500,
      location: "Gurugram, Sector 37",
      notes: "Include cutting & transport. Prefer local supplier."
    },
    {
      id: "B003",
      item: "Plywood MR Grade 18mm",
      qty: "25 sheets",
      price: 1650,
      location: "Noida, Sector 63",
      notes: "Gurjan preferred. Need bill & delivery."
    },
    {
      id: "B004",
      item: "LED Bulbs 9W",
      qty: "200 pcs",
      price: 52,
      location: "Rohini, Delhi",
      notes: "B22 base, 1-year warranty. Immediate purchase."
    },
    {
      id: "B005",
      item: "Sand (Fine)",
      qty: "1 trolley",
      price: 4200,
      location: "Faridabad, Sector 21",
      notes: "Morning delivery tomorrow. Payment UPI on delivery."
    },
    {
      id: "B006",
      item: "Paint Emulsion 20L (White)",
      qty: "8 buckets",
      price: 1650,
      location: "Lajpat Nagar, Delhi",
      notes: "Asian/Berger preferred. Include delivery."
    }
  ]);

  const [svcReqs, setSvcReqs] = useState([
    {
      id: "S001",
      service: "Plumber for Bathroom Leakage",
      price: 1200,
      location: "Dwarka Sector 12, Delhi",
      notes: "Fix concealed pipe leakage, reseal tiles. Required today evening."
    },
    {
      id: "S002",
      service: "AC Servicing (Split 1.5T)",
      price: 700,
      location: "Noida, Sector 18",
      notes: "Chemical wash not required, basic servicing + gas check."
    },
    {
      id: "S003",
      service: "Two-Wheeler Mechanic (On-site)",
      price: 500,
      location: "Gurugram, DLF Phase 3",
      notes: "Scooty self-start issue. Bring basic tools."
    },
    {
      id: "S004",
      service: "Home Deep Cleaning (2BHK)",
      price: 3000,
      location: "Saket, Delhi",
      notes: "Kitchen degreasing and bathroom descaling needed."
    },
    {
      id: "S005",
      service: "CCTV Installation (4 Cameras)",
      price: 4500,
      location: "R.K. Puram, Delhi",
      notes: "Includes wiring, DVR setup. Hardware provided by me."
    },
    {
      id: "S006",
      service: "RO Service & Filter Change",
      price: 900,
      location: "Ghaziabad, Indirapuram",
      notes: "Kent model. Bring compatible filters."
    }
  ]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const pick =
      tab === "Jobs" ? jobs : tab === "Buy Requests" ? buyReqs : svcReqs;
    if (!needle) return pick;
    return pick.filter((obj) =>
      JSON.stringify(obj).toLowerCase().includes(needle)
    );
  }, [q, tab, jobs, buyReqs, svcReqs]);

  // ====== VIEW DETAILS / APPLY MODAL ======
  const openModal = (item) => {
    setSelected({ type: tab, data: item });
    setAppExpectedPrice("");
    setAppMessage("");
  };

  const closeModal = () => {
    setSelected(null);
  };

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    if (!selected) return;

    console.log("Submitting application / quote:", {
      type: selected.type,
      postId: selected.data.id,
      expectedPrice: appExpectedPrice,
      message: appMessage
    });

    alert("Application / quote submitted (demo).");
    closeModal();
  };

  const getPriceLabel = () => {
    if (!selected) return "Expected price (₹)";
    if (selected.type === "Jobs") return "Expected daily/monthly wage (₹)";
    if (selected.type === "Buy Requests") return "Your quote price (₹)";
    if (selected.type === "Service Requests") return "Your service charge (₹)";
    return "Expected price (₹)";
  };

  // ====== POST NEW REQUEST / JOB MODAL ======
  const openPostModal = () => {
    setPostModalType(tab);
    setPostTitle("");
    setPostShopName("");
    setPostQty("");
    setPostPrice("");
    setPostLocation("");
    setPostNotes("");
  };

  const closePostModal = () => {
    setPostModalType(null);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!postModalType) return;

    // JOB: call backend API
    if (postModalType === "Jobs") {
      try {
        setIsPosting(true);

        const shopId =
          localStorage.getItem("shopId") || localStorage.getItem("userId");

        if (!shopId) {
          alert("Shop ID not found. Please login again as shop owner.");
          setIsPosting(false);
          return;
        }

        const payload = {
          shopId,
          shopName: postShopName || undefined,
          jobTitle: postTitle,
          jobDescription: postNotes,
          wage: postPrice,
          location: postLocation
        };

        const res = await axiosInstance.post(
          "/api/users/protected/marketplace/post-job",
          payload,
          { withCredentials: true }
        );

        const newJob = {
          id: res?.data?.postId || "J" + Date.now(),
          title: postTitle,
          shopName: postShopName || "Unknown Shop",
          wage: Number(postPrice) || 0,
          location: postLocation,
          desc: postNotes
        };

        setJobs((prev) => [...prev, newJob]);
        alert("Job posted successfully.");
        closePostModal();
      } catch (err) {
        console.error("Error posting job:", err);
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to post job.";
        alert(msg);
      } finally {
        setIsPosting(false);
      }
      return;
    }

    // BUY REQUEST: call backend API
    if (postModalType === "Buy Requests") {
      try {
        setIsPosting(true);

        const payload = {
          itemName: postTitle,
          quantity: postQty,
          expectedPrice: postPrice,
          location: postLocation,
          description: postNotes
          // buyerId is taken from auth on backend (req.user)
        };

        const res = await axiosInstance.post(
          "/api/users/protected/marketplace/post-buy-request",
          payload,
          { withCredentials: true }
        );

        const newBuy = {
          id: res?.data?.postId || "B" + Date.now(),
          item: postTitle,
          qty: postQty,
          price: Number(postPrice) || 0,
          location: postLocation,
          notes: postNotes
        };

        setBuyReqs((prev) => [...prev, newBuy]);
        alert("Buy request posted successfully.");
        closePostModal();
      } catch (err) {
        console.error("Error posting buy request:", err);
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to post buy request.";
        alert(msg);
      } finally {
        setIsPosting(false);
      }
      return;
    }

    // SERVICE REQUEST: call backend API
    if (postModalType === "Service Requests") {
      try {
        setIsPosting(true);

        const payload = {
          serviceName: postTitle,
          budget: postPrice,
          description: postNotes,
          location: postLocation
          // requesterId from auth (req.user) on backend
        };

        const res = await axiosInstance.post(
          "/api/users/protected/marketplace/post-service-request",
          payload,
          { withCredentials: true }
        );

        const newSvc = {
          id: res?.data?.postId || "S" + Date.now(),
          service: postTitle,
          price: Number(postPrice) || 0,
          location: postLocation,
          notes: postNotes
        };

        setSvcReqs((prev) => [...prev, newSvc]);
        alert("Service request posted successfully.");
        closePostModal();
      } catch (err) {
        console.error("Error posting service request:", err);
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to post service request.";
        alert(msg);
      } finally {
        setIsPosting(false);
      }
      return;
    }
  };

  const getPostButtonLabel = () => {
    if (tab === "Jobs") return "Post Job";
    if (tab === "Buy Requests") return "Post Buy Request";
    return "Post Service Request";
  };

  const getPostTitleLabel = () => {
    if (postModalType === "Jobs") return "Job title";
    if (postModalType === "Buy Requests") return "What do you want to buy?";
    if (postModalType === "Service Requests") return "Which service do you need?";
    return "Title";
  };

  const getPostPriceLabel = () => {
    if (postModalType === "Jobs") return "Wage / salary (₹)";
    if (postModalType === "Buy Requests") return "Your expected price / budget (₹)";
    if (postModalType === "Service Requests") return "Your budget for service (₹)";
    return "Price / budget (₹)";
  };

  const getPostNotesPlaceholder = () => {
    if (postModalType === "Jobs") {
      return "Describe work, timings, experience required, any other details.";
    }
    if (postModalType === "Buy Requests") {
      return "Mention brand, quality, delivery time, payment terms, etc.";
    }
    if (postModalType === "Service Requests") {
      return "Describe work details, timing preference, tools/materials, etc.";
    }
    return "Add more details…";
  };

  return (
    <div className="market_place_page">
      <div className="market_place_header">
        <h2 className="market_place_title">Marketplace</h2>

        <div className="market_place_actions">
          <div className="market_place_tabs">
            {TABS.map((t) => (
              <button
                key={t}
                className={`market_place_tab ${
                  t === tab ? "market_place_tab_active" : ""
                }`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="market_place_right_actions">
            <input
              className="market_place_search_input"
              placeholder={`Search ${tab.toLowerCase()}…`}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button
              className="market_place_post_button"
              onClick={openPostModal}
            >
              {getPostButtonLabel()}
            </button>
          </div>
        </div>
      </div>

      <div className="market_place_grid">
        {list.map((item) => (
          <div
            className="market_place_card"
            key={item.id}
            onClick={() => openModal(item)}
          >
            {tab === "Jobs" && (
              <>
                <div className="market_place_card_head">
                  <h3 className="market_place_card_title">{item.title}</h3>
                  <span className="market_place_tag">₹{item.wage}/day</span>
                </div>
                <div className="market_place_row">
                  <span className="market_place_label">Shop:</span>{" "}
                  <span>{item.shopName}</span>
                </div>
                <div className="market_place_row">
                  <span className="market_place_label">Location:</span>{" "}
                  <span>{item.location}</span>
                </div>
                <p className="market_place_text">{item.desc}</p>
                <div className="market_place_card_footer">
                  <button
                    className="market_place_btn market_place_btn_primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(item);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </>
            )}

            {tab === "Buy Requests" && (
              <>
                <div className="market_place_card_head">
                  <h3 className="market_place_card_title">{item.item}</h3>
                  <span className="market_place_tag">Qty: {item.qty}</span>
                </div>
                <div className="market_place_row">
                  <span className="market_place_label">Offer:</span>{" "}
                  <span>₹{item.price}</span>
                </div>
                <div className="market_place_row">
                  <span className="market_place_label">Location:</span>{" "}
                  <span>{item.location}</span>
                </div>
                <p className="market_place_text">{item.notes}</p>
                <div className="market_place_card_footer">
                  <button
                    className="market_place_btn market_place_btn_primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(item);
                    }}
                  >
                    Contact Buyer
                  </button>
                </div>
              </>
            )}

            {tab === "Service Requests" && (
              <>
                <div className="market_place_card_head">
                  <h3 className="market_place_card_title">{item.service}</h3>
                  <span className="market_place_tag">
                    Budget: ₹{item.price}
                  </span>
                </div>
                <div className="market_place_row">
                  <span className="market_place_label">Location:</span>{" "}
                  <span>{item.location}</span>
                </div>
                <p className="market_place_text">{item.notes}</p>
                <div className="market_place_card_footer">
                  <button
                    className="market_place_btn market_place_btn_primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(item);
                    }}
                  >
                    Offer Service
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {list.length === 0 && (
          <div className="market_place_empty">
            Nothing here yet. Be the first to post!
          </div>
        )}
      </div>

      {/* ========== VIEW DETAILS + APPLICATION / QUOTE MODAL ========== */}
      {selected && (
        <div
          className="market_place_modal_overlay"
          onClick={closeModal}
        >
          <div
            className="market_place_modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="market_place_modal_close"
              onClick={closeModal}
            >
              ✕
            </button>

            {/* Details */}
            {selected.type === "Jobs" && (
              <>
                <h2 className="market_place_modal_title">
                  {selected.data.title}
                </h2>
                <p className="market_place_modal_highlight">
                  Wage: ₹{selected.data.wage}/day
                </p>
                <p className="market_place_modal_row">
                  <span className="market_place_modal_label">Shop:</span>{" "}
                  {selected.data.shopName}
                </p>
                <p className="market_place_modal_row">
                  <span className="market_place_modal_label">Location:</span>{" "}
                  {selected.data.location}
                </p>
                <p className="market_place_modal_description">
                  {selected.data.desc}
                </p>
              </>
            )}

            {selected.type === "Buy Requests" && (
              <>
                <h2 className="market_place_modal_title">
                  {selected.data.item}
                </h2>
                <p className="market_place_modal_highlight">
                  Quantity: {selected.data.qty}
                </p>
                <p className="market_place_modal_row">
                  <span className="market_place_modal_label">Buyer offer:</span>{" "}
                  ₹{selected.data.price}
                </p>
                <p className="market_place_modal_row">
                  <span className="market_place_modal_label">Location:</span>{" "}
                  {selected.data.location}
                </p>
                <p className="market_place_modal_description">
                  {selected.data.notes}
                </p>
              </>
            )}

            {selected.type === "Service Requests" && (
              <>
                <h2 className="market_place_modal_title">
                  {selected.data.service}
                </h2>
                <p className="market_place_modal_highlight">
                  Budget: ₹{selected.data.price}
                </p>
                <p className="market_place_modal_row">
                  <span className="market_place_modal_label">Location:</span>{" "}
                  {selected.data.location}
                </p>
                <p className="market_place_modal_description">
                  {selected.data.notes}
                </p>
              </>
            )}

            {/* Application / Quote form */}
            <form
              className="market_place_application_form"
              onSubmit={handleApplicationSubmit}
            >
              <h3 className="market_place_form_title">
                {selected.type === "Jobs"
                  ? "Apply for this job"
                  : selected.type === "Buy Requests"
                  ? "Submit your quote"
                  : "Offer your service"}
              </h3>

              <div className="market_place_form_group">
                <label className="market_place_form_label">
                  {getPriceLabel()}
                </label>
                <input
                  type="number"
                  className="market_place_form_input"
                  value={appExpectedPrice}
                  onChange={(e) => setAppExpectedPrice(e.target.value)}
                  placeholder="e.g. 800"
                />
              </div>

              <div className="market_place_form_group">
                <label className="market_place_form_label">
                  Message / details
                </label>
                <textarea
                  className="market_place_form_textarea"
                  value={appMessage}
                  onChange={(e) => setAppMessage(e.target.value)}
                  placeholder={
                    selected.type === "Jobs"
                      ? "Mention your experience, availability etc."
                      : selected.type === "Buy Requests"
                      ? "Mention delivery time, brand, terms etc."
                      : "Describe your experience and what you will provide."
                  }
                  rows={4}
                  required
                />
              </div>

              <div className="market_place_modal_actions">
                <button
                  type="submit"
                  className="market_place_btn market_place_btn_primary"
                >
                  {selected.type === "Jobs"
                    ? "Submit Job Application"
                    : selected.type === "Buy Requests"
                    ? "Submit Quote"
                    : "Submit Service Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== POST NEW JOB / REQUEST MODAL ========== */}
      {postModalType && (
        <div
          className="market_place_modal_overlay"
          onClick={closePostModal}
        >
          <div
            className="market_place_modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="market_place_modal_close"
              onClick={closePostModal}
            >
              ✕
            </button>

            <h2 className="market_place_modal_title">
              {postModalType === "Jobs"
                ? "Post a Job"
                : postModalType === "Buy Requests"
                ? "Post a Buy Request"
                : "Post a Service Request"}
            </h2>

            <form
              className="market_place_application_form"
              onSubmit={handlePostSubmit}
            >
              <div className="market_place_form_group">
                <label className="market_place_form_label">
                  {getPostTitleLabel()}
                </label>
                <input
                  type="text"
                  className="market_place_form_input"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  required
                />
              </div>

              {postModalType === "Jobs" && (
                <div className="market_place_form_group">
                  <label className="market_place_form_label">
                    Shop / Company name
                  </label>
                  <input
                    type="text"
                    className="market_place_form_input"
                    value={postShopName}
                    onChange={(e) => setPostShopName(e.target.value)}
                    placeholder="Optional (can be taken from profile later)"
                  />
                </div>
              )}

              {postModalType === "Buy Requests" && (
                <div className="market_place_form_group">
                  <label className="market_place_form_label">
                    Quantity
                  </label>
                  <input
                    type="text"
                    className="market_place_form_input"
                    value={postQty}
                    onChange={(e) => setPostQty(e.target.value)}
                    placeholder="e.g. 100 bags, 2 tons"
                  />
                </div>
              )}

              <div className="market_place_form_group">
                <label className="market_place_form_label">
                  {getPostPriceLabel()}
                </label>
                <input
                  type="number"
                  className="market_place_form_input"
                  value={postPrice}
                  onChange={(e) => setPostPrice(e.target.value)}
                  placeholder="e.g. 700"
                />
              </div>

              <div className="market_place_form_group">
                <label className="market_place_form_label">
                  Location
                </label>
                <input
                  type="text"
                  className="market_place_form_input"
                  value={postLocation}
                  onChange={(e) => setPostLocation(e.target.value)}
                  placeholder="Area, city (e.g. Rohini, Delhi)"
                />
              </div>

              <div className="market_place_form_group">
                <label className="market_place_form_label">
                  Details / description
                </label>
                <textarea
                  className="market_place_form_textarea"
                  value={postNotes}
                  onChange={(e) => setPostNotes(e.target.value)}
                  placeholder={getPostNotesPlaceholder()}
                  rows={4}
                  required
                />
              </div>

              <div className="market_place_modal_actions">
                <button
                  type="submit"
                  className="market_place_btn market_place_btn_primary"
                  disabled={isPosting}
                >
                  {isPosting
                    ? "Posting..."
                    : postModalType === "Jobs"
                    ? "Post Job"
                    : postModalType === "Buy Requests"
                    ? "Post Buy Request"
                    : "Post Service Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
