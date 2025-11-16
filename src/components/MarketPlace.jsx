import React, { useMemo, useState } from "react";
import "./shop.css";

const TABS = ["Jobs", "Buy Requests", "Service Requests"];

export default function Marketplace() {
  const [tab, setTab] = useState(TABS[0]);

  const [jobs] = useState([
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
      desc: "Interior painting for 2BHK apartments. Tools available on site."
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

  const [buyReqs] = useState([
    {
      id: "B001",
      item: "Cement (Ultratech/ACC)",
      qty: "100 bags",
      price: 350, // per bag
      location: "Najafgarh, Delhi",
      notes: "Need within 2 days. Unloading required. Quote inclusive of GST."
    },
    {
      id: "B002",
      item: "Mild Steel Rods 12mm",
      qty: "1.5 tons",
      price: 52500, // total offer
      location: "Gurugram, Sector 37",
      notes: "Include cutting & transport. Prefer local supplier."
    },
    {
      id: "B003",
      item: "Plywood MR Grade 18mm",
      qty: "25 sheets",
      price: 1650, // per sheet
      location: "Noida, Sector 63",
      notes: "Gurjan preferred. Need bill & delivery."
    },
    {
      id: "B004",
      item: "LED Bulbs 9W",
      qty: "200 pcs",
      price: 52, // per piece
      location: "Rohini, Delhi",
      notes: "B22 base, 1-year warranty. Immediate purchase."
    },
    {
      id: "B005",
      item: "Sand (Fine)",
      qty: "1 trolley",
      price: 4200, // per trolley
      location: "Faridabad, Sector 21",
      notes: "Morning delivery tomorrow. Payment UPI on delivery."
    },
    {
      id: "B006",
      item: "Paint Emulsion 20L (White)",
      qty: "8 buckets",
      price: 1650, // per bucket
      location: "Lajpat Nagar, Delhi",
      notes: "Asian/Berger preferred. Include delivery."
    }
  ]);

  const [svcReqs] = useState([
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

  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const pick =
      tab === "Jobs" ? jobs : tab === "Buy Requests" ? buyReqs : svcReqs;
    if (!needle) return pick;
    return pick.filter((obj) =>
      JSON.stringify(obj).toLowerCase().includes(needle)
    );
  }, [q, tab, jobs, buyReqs, svcReqs]);

  return (
    <div className="shop_page">
      <div className="shop_page_head">
        <h2 className="shop_title">Marketplace</h2>
        <div className="shop_actions">
          <div className="shop_tabs">
            {TABS.map((t) => (
              <button
                key={t}
                className={`shop_tab ${t === tab ? "shop_tab_active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <input
            className="shop_input"
            placeholder={`Search ${tab.toLowerCase()}…`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="shop_grid">
        {list.map((item) => (
          <div className="shop_card" key={item.id}>
            {tab === "Jobs" && (
              <>
                <div className="shop_card_head">
                  <h3 className="shop_card_title">{item.title}</h3>
                  <span className="shop_tag">₹{item.wage}/day</span>
                </div>
                <div className="shop_row">
                  <span className="shop_label">Shop:</span> <span>{item.shopName}</span>
                </div>
                <div className="shop_row">
                  <span className="shop_label">Location:</span>{" "}
                  <span>{item.location}</span>
                </div>
                <p className="shop_text">{item.desc}</p>
                <div className="shop_card_footer">
                  <button className="shop_btn shop_btn_primary">Apply</button>
                </div>
              </>
            )}

            {tab === "Buy Requests" && (
              <>
                <div className="shop_card_head">
                  <h3 className="shop_card_title">{item.item}</h3>
                  <span className="shop_tag">Qty: {item.qty}</span>
                </div>
                <div className="shop_row">
                  <span className="shop_label">Offer:</span>{" "}
                  <span>₹{item.price}</span>
                </div>
                <div className="shop_row">
                  <span className="shop_label">Location:</span>{" "}
                  <span>{item.location}</span>
                </div>
                <p className="shop_text">{item.notes}</p>
                <div className="shop_card_footer">
                  <button className="shop_btn shop_btn_primary">Contact Buyer</button>
                </div>
              </>
            )}

            {tab === "Service Requests" && (
              <>
                <div className="shop_card_head">
                  <h3 className="shop_card_title">{item.service}</h3>
                  <span className="shop_tag">Budget: ₹{item.price}</span>
                </div>
                <div className="shop_row">
                  <span className="shop_label">Location:</span>{" "}
                  <span>{item.location}</span>
                </div>
                <p className="shop_text">{item.notes}</p>
                <div className="shop_card_footer">
                  <button className="shop_btn shop_btn_primary">Offer Service</button>
                </div>
              </>
            )}
          </div>
        ))}

        {list.length === 0 && (
          <div className="shop_empty">Nothing here yet. Be the first to post!</div>
        )}
      </div>
    </div>
  );
}
