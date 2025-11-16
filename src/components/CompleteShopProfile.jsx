// import React, { useState } from "react";
// import axiosInstance from "../axiosConfig";
// import "./CompleteShopProfile.css"; // keep your existing CSS (uses complete_shop_profile_* names)

// const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

// export default function CompleteShopProfileSinglePage({ initial = {} }) {
//   // basics
//   const [shopName, setShopName] = useState(initial.shopName || "");
//   const [category, setCategory] = useState(initial.category || "");
//   const [tagline, setTagline] = useState(initial.tagline || "");
//   const [whatsapp, setWhatsapp] = useState(initial.whatsapp || "");
//   const [about, setAbout] = useState(initial.about || "");

//   // address
//   const [address, setAddress] = useState(initial.address || "");
//   const [city, setCity] = useState(initial.city || "");
//   const [pincode, setPincode] = useState(initial.pincode || "");
//   const [landmark, setLandmark] = useState(initial.landmark || "");

//   // photos
//   const [logoFile, setLogoFile] = useState(null);
//   const [logoPreview, setLogoPreview] = useState(initial.photosPreview || "");

//   // hours (array of { day, open, from, to })
//   const [hours, setHours] = useState(() => (
//     initial.hours || DAYS.map(d => ({ day: d, open: true, from: "09:30", to: "20:30" }))
//   ));

//   // catalog: items and services
//   const [items, setItems] = useState(() => initial.items || []);
//   const [services, setServices] = useState(() => initial.services || []);

//   const [busy, setBusy] = useState(false);
//   const [errors, setErrors] = useState({});

//   // helpers for items/services
//   const addItem = () => setItems(s => [...s, { id: crypto.randomUUID(), name: "", price: "", unit: "" }]);
//   const addService = () => setServices(s => [...s, { id: crypto.randomUUID(), name: "", price: "", unit: "", eta: "" }]);
//   const updateItem = (id, patch) => setItems(s => s.map(x => x.id === id ? { ...x, ...patch } : x));
//   const updateService = (id, patch) => setServices(s => s.map(x => x.id === id ? { ...x, ...patch } : x));
//   const removeItem = id => setItems(s => s.filter(x => x.id !== id));
//   const removeService = id => setServices(s => s.filter(x => x.id !== id));

//   // file handlers
//   const handleLogoSelect = (file) => {
//     if (!file) return;
//     setLogoFile(file);
//     setLogoPreview(URL.createObjectURL(file));
//   };

//   // validation before submit
//   const validateAll = () => {
//     const e = {};
//     if (!shopName.trim()) e.shopName = "Shop name required";
//     if (!category.trim()) e.category = "Category required";
//     if (!about.trim()) e.about = "Short description required";
//     if (!whatsapp.trim()) e.whatsapp = "WhatsApp required";
//     if (!address.trim()) e.address = "Address required";
//     if (!city.trim()) e.city = "City required";
//     if (!pincode.trim()) e.pincode = "Pincode required";

//     // check hours sanity
//     for (const h of hours) {
//       if (h.open && (!h.from || !h.to)) { e.hours = "Please provide opening and closing times"; break; }
//     }

//     // catalog: at least one item or service
//     if ((items.length === 0) && (services.length === 0)) {
//       e.catalog = "Add at least one item or service";
//     } else {
//       // ensure names present
//       for (const it of items) if (!it.name.trim()) { e.catalog = "All items must have a name"; break; }
//       for (const sv of services) if (!sv.name.trim()) { e.catalog = "All services must have a name"; break; }
//     }

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   // read shop id from localStorage
//   const getShopId = () => localStorage.getItem("shopId");

//   // upload logo first (if provided) — expects backend route POST /shops/:shopId/photos/upload
//   async function uploadLogo(shopId) {
//     if (!logoFile) return null;
//     const form = new FormData();
//     form.append("logo", logoFile); // backend expects field "logo"
//     const res = await axiosInstance.post(`/api/users/protected/shops/${shopId}/photos/upload`, form, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     // backend returns preview.logoUrl maybe; we ignore keys — we rely on server-side keys
//     return res.data;
//   }

//   // submit entire payload: upload image first then send JSON to /shops/:shopId/details?finalize=1
//   const handleSubmit = async (ev) => {
//     ev?.preventDefault?.();
//     if (!validateAll()) {
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       return;
//     }

//     const shopId = getShopId();
//     if (!shopId) {
//       alert("shopId not found in localStorage. Please create a shop draft first.");
//       return;
//     }

//     setBusy(true);
//     setErrors({});

//     try {
//       // 1) upload image if present
//       if (logoFile) {
//         await uploadLogo(shopId);
//         // optionally: update preview with server preview by re-fetching /shops/:shopId
//       }

//       // 2) build payload
//       const payload = {
//         basics: {
//           shopName: shopName.trim(),
//           category: category.trim(),
//           tagline: tagline.trim(),
//           whatsapp: whatsapp.trim(),
//           about: about.trim(),
//         },
//         contact: {
//           address: address.trim(),
//           city: city.trim(),
//           pincode: pincode.trim(),
//           landmark: landmark.trim() || null,
//         },
//         catalog: {
//           items: items.map(it => ({ name: it.name.trim(), price: it.price, unit: it.unit })),
//           services: services.map(sv => ({ name: sv.name.trim(), price: sv.price, unit: sv.unit, eta: sv.eta })),
//         },
//         hours: hours.map(h => ({ day: h.day, open: !!h.open, from: h.from, to: h.to })),
//       };

//       // 3) finalize: server should validate required fields and set PENDING_REVIEW
//       const res = await axiosInstance.post(`/api/users/protected/shops/${shopId}/details?finalize=1`, payload, {
//         headers: { "Content-Type": "application/json" }
//       });

//       // success
//       alert("Shop submitted for review.");
//       // optionally redirect or update state with returned shop
//       // e.g. console.log(res.data.shop)
//     } catch (err) {
//       console.error(err);
//       if (err?.response?.status === 422) {
//         const details = err.response.data?.details || [];
//         alert("Validation errors:\n" + (details.join ? details.join("\n") : JSON.stringify(details)));
//       } else {
//         alert(err?.response?.data?.error || err.message || "Submission failed");
//       }
//     } finally {
//       setBusy(false);
//     }
//   };

//   // UI helpers for hours toggle/time change
//   const setHourOpen = (index, open) => setHours(h => h.map((x,i) => i===index ? { ...x, open } : x));
//   const setHourFrom = (index, from) => setHours(h => h.map((x,i) => i===index ? { ...x, from } : x));
//   const setHourTo = (index, to) => setHours(h => h.map((x,i) => i===index ? { ...x, to } : x));

//   return (
//     <form className="complete_shop_profile_page" onSubmit={handleSubmit}>
//       <h2 className="complete_shop_profile_owner_hi">Complete Shop Profile</h2>

//       <div className="complete_shop_profile_panel" style={{ marginTop: 12 }}>
//         {/* BASICS */}
//         <div className="complete_shop_profile_grid_2">
//           <div className="complete_shop_profile_field">
//             <label>Shop Name <span className="complete_shop_profile_req">*</span></label>
//             <input className={`complete_shop_profile_input ${errors.shopName ? "has-error" : ""}`}
//               value={shopName} onChange={e => setShopName(e.target.value)} placeholder="Sharma Hardware" />
//             {errors.shopName && <div className="complete_shop_profile_error">{errors.shopName}</div>}
//           </div>

//           <div className="complete_shop_profile_field">
//             <label>Category <span className="complete_shop_profile_req">*</span></label>
//             <input className={`complete_shop_profile_input ${errors.category ? "has-error" : ""}`}
//               value={category} onChange={e => setCategory(e.target.value)} placeholder="Hardware" />
//             {errors.category && <div className="complete_shop_profile_error">{errors.category}</div>}
//           </div>

//           <div className="complete_shop_profile_field">
//             <label>Tagline</label>
//             <input className="complete_shop_profile_input" value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Everything for home renovation" />
//           </div>

//           <div className="complete_shop_profile_field">
//             <label>WhatsApp <span className="complete_shop_profile_req">*</span></label>
//             <input className={`complete_shop_profile_input ${errors.whatsapp ? "has-error" : ""}`}
//               value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+91 98xxxx xxxx" />
//             {errors.whatsapp && <div className="complete_shop_profile_error">{errors.whatsapp}</div>}
//           </div>

//           <div className="complete_shop_profile_field complete_shop_profile_col_span_2">
//             <label>About (short description) <span className="complete_shop_profile_req">*</span></label>
//             <textarea className={`complete_shop_profile_input ${errors.about ? "has-error" : ""}`}
//               rows={4} value={about} onChange={e => setAbout(e.target.value)} placeholder="A short description of your shop..." />
//             {errors.about && <div className="complete_shop_profile_error">{errors.about}</div>}
//           </div>
//         </div>

//         {/* ADDRESS */}
//         <h4 style={{ marginTop: 8 }}>Address</h4>
//         <div className="complete_shop_profile_grid_2">
//           <div className="complete_shop_profile_field complete_shop_profile_col_span_2">
//             <label>Address <span className="complete_shop_profile_req">*</span></label>
//             <input className={`complete_shop_profile_input ${errors.address ? "has-error" : ""}`}
//               value={address} onChange={e => setAddress(e.target.value)} placeholder="B-12, Main Market, Rohini" />
//             {errors.address && <div className="complete_shop_profile_error">{errors.address}</div>}
//           </div>

//           <div className="complete_shop_profile_field">
//             <label>City <span className="complete_shop_profile_req">*</span></label>
//             <input className={`complete_shop_profile_input ${errors.city ? "has-error" : ""}`}
//               value={city} onChange={e => setCity(e.target.value)} placeholder="Delhi" />
//             {errors.city && <div className="complete_shop_profile_error">{errors.city}</div>}
//           </div>

//           <div className="complete_shop_profile_field">
//             <label>Pincode <span className="complete_shop_profile_req">*</span></label>
//             <input className={`complete_shop_profile_input ${errors.pincode ? "has-error" : ""}`}
//               value={pincode} onChange={e => setPincode(e.target.value)} placeholder="110085" />
//             {errors.pincode && <div className="complete_shop_profile_error">{errors.pincode}</div>}
//           </div>

//           <div className="complete_shop_profile_field complete_shop_profile_col_span_2">
//             <label>Landmark</label>
//             <input className="complete_shop_profile_input" value={landmark} onChange={e => setLandmark(e.target.value)} placeholder="Near metro gate" />
//           </div>
//         </div>

//         {/* PHOTO */}
//         <div className="complete_shop_profile_field" style={{ marginTop: 8 }}>
//           <label>Shop Image</label>
//           <div className="complete_shop_profile_upload_box">
//             {logoPreview ? <img className="complete_shop_profile_preview" src={logoPreview} alt="shop" /> :
//               <div className="complete_shop_profile_upload_hint">Upload a shop image (will be uploaded first)</div>}
//             <input type="file" accept="image/*" className="complete_shop_profile_file_input"
//               onChange={e => handleLogoSelect(e.target.files?.[0])} />
//           </div>
//         </div>

//         {/* HOURS */}
//         <h4 style={{ marginTop: 12 }}>Opening Hours</h4>
//         <div className="complete_shop_profile_hours_grid">
//           {hours.map((h, i) => (
//             <div key={h.day} className="complete_shop_profile_hour_row">
//               <div className="complete_shop_profile_hour_day">{h.day}</div>
//               <label className="complete_shop_profile_switch compact">
//                 <input type="checkbox" checked={h.open} onChange={e => setHourOpen(i, e.target.checked)} />
//                 <span>{h.open ? "Open" : "Closed"}</span>
//               </label>
//               <input type="time" className="complete_shop_profile_input" disabled={!h.open} value={h.from} onChange={e => setHourFrom(i, e.target.value)} />
//               <div className="complete_shop_profile_time_sep">to</div>
//               <input type="time" className="complete_shop_profile_input" disabled={!h.open} value={h.to} onChange={e => setHourTo(i, e.target.value)} />
//             </div>
//           ))}
//         </div>
//         {errors.hours && <div className="complete_shop_profile_error" style={{ marginTop: 8 }}>{errors.hours}</div>}

//         {/* CATALOG */}
//         <h4 style={{ marginTop: 12 }}>Items & Services</h4>
//         <div className="complete_shop_profile_grid_2">
//           {/* Items */}
//           <div className="complete_shop_profile_card like-border">
//             <div className="complete_shop_profile_card_head">
//               <h3 className="complete_shop_profile_card_title">Items</h3>
//               <button type="button" className="complete_shop_profile_btn complete_shop_profile_btn_primary" onClick={addItem}>+ Add Item</button>
//             </div>
//             {items.length === 0 && <div className="complete_shop_profile_empty small">No items yet</div>}
//             {items.map((it, idx) => (
//               <div key={it.id} className="complete_shop_profile_row">
//                 <input className="complete_shop_profile_input" placeholder={`Item ${idx+1} name`} value={it.name} onChange={e => updateItem(it.id, { name: e.target.value })} />
//                 <input className="complete_shop_profile_input" placeholder="Price" value={it.price} onChange={e => updateItem(it.id, { price: e.target.value })} />
//                 <input className="complete_shop_profile_input" placeholder="Unit" value={it.unit} onChange={e => updateItem(it.id, { unit: e.target.value })} />
//                 <button type="button" className="complete_shop_profile_btn complete_shop_profile_btn_danger" onClick={() => removeItem(it.id)}>Remove</button>
//               </div>
//             ))}
//           </div>

//           {/* Services */}
//           <div className="complete_shop_profile_card like-border">
//             <div className="complete_shop_profile_card_head">
//               <h3 className="complete_shop_profile_card_title">Services</h3>
//               <button type="button" className="complete_shop_profile_btn complete_shop_profile_btn_primary" onClick={addService}>+ Add Service</button>
//             </div>
//             {services.length === 0 && <div className="complete_shop_profile_empty small">No services yet</div>}
//             {services.map((sv, idx) => (
//               <div key={sv.id} className="complete_shop_profile_row">
//                 <input className="complete_shop_profile_input" placeholder={`Service ${idx+1} name`} value={sv.name} onChange={e => updateService(sv.id, { name: e.target.value })} />
//                 <input className="complete_shop_profile_input" placeholder="Price" value={sv.price} onChange={e => updateService(sv.id, { price: e.target.value })} />
//                 <input className="complete_shop_profile_input" placeholder="Unit" value={sv.unit} onChange={e => updateService(sv.id, { unit: e.target.value })} />
//                 <input className="complete_shop_profile_input" placeholder="ETA" value={sv.eta} onChange={e => updateService(sv.id, { eta: e.target.value })} />
//                 <button type="button" className="complete_shop_profile_btn complete_shop_profile_btn_danger" onClick={() => removeService(sv.id)}>Remove</button>
//               </div>
//             ))}
//           </div>
//         </div>
//         {errors.catalog && <div className="complete_shop_profile_error" style={{ marginTop: 8 }}>{errors.catalog}</div>}

//         {/* ACTIONS */}
//         <div className="complete_shop_profile_actions" style={{ marginTop: 16 }}>
//           <div className="complete_shop_profile_spacer" />
//           <button type="button" className="complete_shop_profile_btn complete_shop_profile_btn_primary" onClick={handleSubmit} disabled={busy}>
//             {busy ? "Submitting..." : "Submit Application"}
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// }


import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import "./CompleteShopProfile.css"; // uses complete_shop_profile_* classes

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CompleteShopProfileSinglePage({ initial = {} }) {
  // basics
  const [shopName, setShopName] = useState(initial.shopName || "");
  const [category, setCategory] = useState(initial.category || "");
  const [tagline, setTagline] = useState(initial.tagline || "");
  const [whatsapp, setWhatsapp] = useState(initial.whatsapp || "");
  const [about, setAbout] = useState(initial.about || "");

  // address
  const [address, setAddress] = useState(initial.address || "");
  const [city, setCity] = useState(initial.city || "");
  const [pincode, setPincode] = useState(initial.pincode || "");
  const [landmark, setLandmark] = useState(initial.landmark || "");

  // photos
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(initial.photosPreview || "");

  // hours (array of { day, open, from, to })
  const [hours, setHours] = useState(() =>
    initial.hours ||
    DAYS.map((d) => ({ day: d, open: true, from: "09:30", to: "20:30" }))
  );

  // catalog: items and services
  const [items, setItems] = useState(() => initial.items || []);
  const [services, setServices] = useState(() => initial.services || []);

  const [busy, setBusy] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [errors, setErrors] = useState({});

  // ====== FETCH EXISTING SHOP & PREFILL ======
  useEffect(() => {
    async function fetchShop() {
      try {
        setLoadingInitial(true);
        setLoadError("");

        const res = await axiosInstance.get(
          "/api/users/protected/shops/me"
        );
        const shop = res.data?.shop;

        if (!shop) {
          setLoadingInitial(false);
          return;
        }

        // Save shopId in localStorage so submit flow can use it
        if (shop.id) {
          localStorage.setItem("shopId", shop.id);
        }

        const basics = shop.basics || {};
        const contact = shop.contact || {};
        const catalog = shop.catalog || {};
        const hoursArr = Array.isArray(shop.hours) ? shop.hours : null;

        // Basics
        setShopName(basics.shopName || "");
        setCategory(basics.category || "");
        setTagline(basics.tagline || "");
        setWhatsapp(basics.whatsapp || "");
        setAbout(basics.about || "");

        // Contact
        setAddress(contact.address || "");
        setCity(contact.city || "");
        setPincode(contact.pincode || "");
        setLandmark(contact.landmark || "");

        // Photo preview (from backend presigned URL)
        if (shop.photoUrl) {
          setLogoPreview(shop.photoUrl);
        }

        // Hours
        if (hoursArr && hoursArr.length) {
          // Ensure each day has day/open/from/to
          setHours(
            DAYS.map((day) => {
              const existing = hoursArr.find((h) => h.day === day);
              return (
                existing || {
                  day,
                  open: true,
                  from: "09:30",
                  to: "20:30",
                }
              );
            })
          );
        }

        // Catalog
        const backendItems = Array.isArray(catalog.items)
          ? catalog.items
          : [];
        const backendServices = Array.isArray(catalog.services)
          ? catalog.services
          : [];

        // Give each item/service a local id for React/key
        setItems(
          backendItems.map((it) => ({
            id: crypto.randomUUID(),
            name: it.name || "",
            price: it.price || "",
            unit: it.unit || "",
          }))
        );
        setServices(
          backendServices.map((sv) => ({
            id: crypto.randomUUID(),
            name: sv.name || "",
            price: sv.price || "",
            unit: sv.unit || "",
            eta: sv.eta || "",
          }))
        );
      } catch (err) {
        console.error("Failed to load shop for editing:", err);
        setLoadError(
          err?.response?.data?.error ||
            err?.message ||
            "Failed to load shop profile."
        );
      } finally {
        setLoadingInitial(false);
      }
    }

    fetchShop();
  }, []);

  // helpers for items/services
  const addItem = () =>
    setItems((s) => [
      ...s,
      { id: crypto.randomUUID(), name: "", price: "", unit: "" },
    ]);
  const addService = () =>
    setServices((s) => [
      ...s,
      { id: crypto.randomUUID(), name: "", price: "", unit: "", eta: "" },
    ]);
  const updateItem = (id, patch) =>
    setItems((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const updateService = (id, patch) =>
    setServices((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const removeItem = (id) =>
    setItems((s) => s.filter((x) => x.id !== id));
  const removeService = (id) =>
    setServices((s) => s.filter((x) => x.id !== id));

  // file handlers
  const handleLogoSelect = (file) => {
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  // validation before submit
  const validateAll = () => {
    const e = {};
    if (!shopName.trim()) e.shopName = "Shop name required";
    if (!category.trim()) e.category = "Category required";
    if (!about.trim()) e.about = "Short description required";
    if (!whatsapp.trim()) e.whatsapp = "WhatsApp required";
    if (!address.trim()) e.address = "Address required";
    if (!city.trim()) e.city = "City required";
    if (!pincode.trim()) e.pincode = "Pincode required";

    // check hours sanity
    for (const h of hours) {
      if (h.open && (!h.from || !h.to)) {
        e.hours = "Please provide opening and closing times";
        break;
      }
    }

    // catalog: at least one item or service
    if (items.length === 0 && services.length === 0) {
      e.catalog = "Add at least one item or service";
    } else {
      for (const it of items) {
        if (!it.name.trim()) {
          e.catalog = "All items must have a name";
          break;
        }
      }
      for (const sv of services) {
        if (!sv.name.trim()) {
          e.catalog = "All services must have a name";
          break;
        }
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // read shop id from localStorage
  const getShopId = () => localStorage.getItem("shopId");

  // upload logo first (if provided)
  async function uploadLogo(shopId) {
    if (!logoFile) return null;
    const form = new FormData();
    form.append("logo", logoFile); // backend expects field "logo"
    const res = await axiosInstance.post(
      `/api/users/protected/shops/${shopId}/photos/upload`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  }

  // submit full payload
  const handleSubmit = async (ev) => {
    ev?.preventDefault?.();
    if (!validateAll()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const shopId = getShopId();
    if (!shopId) {
      alert(
        "shopId not found in localStorage. Please open this page from your shop dashboard."
      );
      return;
    }

    setBusy(true);
    setErrors({});

    try {
      // 1) upload image if present
      if (logoFile) {
        await uploadLogo(shopId);
      }

      // 2) build payload
      const payload = {
        basics: {
          shopName: shopName.trim(),
          category: category.trim(),
          tagline: tagline.trim(),
          whatsapp: whatsapp.trim(),
          about: about.trim(),
        },
        contact: {
          address: address.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
          landmark: landmark.trim() || null,
        },
        catalog: {
          items: items.map((it) => ({
            name: it.name.trim(),
            price: it.price,
            unit: it.unit,
          })),
          services: services.map((sv) => ({
            name: sv.name.trim(),
            price: sv.price,
            unit: sv.unit,
            eta: sv.eta,
          })),
        },
        hours: hours.map((h) => ({
          day: h.day,
          open: !!h.open,
          from: h.from,
          to: h.to,
        })),
      };

      // 3) finalize
      const res = await axiosInstance.post(
        `/api/users/protected/shops/${shopId}/details?finalize=1`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      alert("Shop submitted for review.");
      console.log("Saved shop:", res.data.shop);
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 422) {
        const details = err.response.data?.details || [];
        alert(
          "Validation errors:\n" +
            (details.join ? details.join("\n") : JSON.stringify(details))
        );
      } else {
        alert(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            err.message ||
            "Submission failed"
        );
      }
    } finally {
      setBusy(false);
    }
  };

  // UI helpers for hours
  const setHourOpen = (index, open) =>
    setHours((h) =>
      h.map((x, i) => (i === index ? { ...x, open } : x))
    );
  const setHourFrom = (index, from) =>
    setHours((h) =>
      h.map((x, i) => (i === index ? { ...x, from } : x))
    );
  const setHourTo = (index, to) =>
    setHours((h) =>
      h.map((x, i) => (i === index ? { ...x, to } : x))
    );

  if (loadingInitial) {
    return (
      <div className="complete_shop_profile_page">
        <div className="complete_shop_profile_panel">
          Loading shop profile…
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="complete_shop_profile_page">
        <div className="complete_shop_profile_panel">
          <div className="complete_shop_profile_error">
            {loadError}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="complete_shop_profile_page" onSubmit={handleSubmit}>
      <h2 className="complete_shop_profile_owner_hi">
        Complete Shop Profile
      </h2>

      <div className="complete_shop_profile_panel" style={{ marginTop: 12 }}>
        {/* BASICS */}
        <div className="complete_shop_profile_grid_2">
          <div className="complete_shop_profile_field">
            <label>
              Shop Name{" "}
              <span className="complete_shop_profile_req">*</span>
            </label>
            <input
              className={`complete_shop_profile_input ${
                errors.shopName ? "has-error" : ""
              }`}
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Sharma Hardware"
            />
            {errors.shopName && (
              <div className="complete_shop_profile_error">
                {errors.shopName}
              </div>
            )}
          </div>

          <div className="complete_shop_profile_field">
            <label>
              Category{" "}
              <span className="complete_shop_profile_req">*</span>
            </label>
            <input
              className={`complete_shop_profile_input ${
                errors.category ? "has-error" : ""
              }`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Hardware"
            />
            {errors.category && (
              <div className="complete_shop_profile_error">
                {errors.category}
              </div>
            )}
          </div>

          <div className="complete_shop_profile_field">
            <label>Tagline</label>
            <input
              className="complete_shop_profile_input"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Everything for home renovation"
            />
          </div>

          <div className="complete_shop_profile_field">
            <label>
              WhatsApp{" "}
              <span className="complete_shop_profile_req">*</span>
            </label>
            <input
              className={`complete_shop_profile_input ${
                errors.whatsapp ? "has-error" : ""
              }`}
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+91 98xxxx xxxx"
            />
            {errors.whatsapp && (
              <div className="complete_shop_profile_error">
                {errors.whatsapp}
              </div>
            )}
          </div>

          <div className="complete_shop_profile_field complete_shop_profile_col_span_2">
            <label>
              About (short description){" "}
              <span className="complete_shop_profile_req">*</span>
            </label>
            <textarea
              className={`complete_shop_profile_input ${
                errors.about ? "has-error" : ""
              }`}
              rows={4}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="A short description of your shop..."
            />
            {errors.about && (
              <div className="complete_shop_profile_error">
                {errors.about}
              </div>
            )}
          </div>
        </div>

        {/* ADDRESS */}
        <h4 style={{ marginTop: 8 }}>Address</h4>
        <div className="complete_shop_profile_grid_2">
          <div className="complete_shop_profile_field complete_shop_profile_col_span_2">
            <label>
              Address{" "}
              <span className="complete_shop_profile_req">*</span>
            </label>
            <input
              className={`complete_shop_profile_input ${
                errors.address ? "has-error" : ""
              }`}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Block B, House no. 49, Rama Park"
            />
            {errors.address && (
              <div className="complete_shop_profile_error">
                {errors.address}
              </div>
            )}
          </div>

          <div className="complete_shop_profile_field">
            <label>
              City{" "}
              <span className="complete_shop_profile_req">*</span>
            </label>
            <input
              className={`complete_shop_profile_input ${
                errors.city ? "has-error" : ""
              }`}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="New Delhi"
            />
            {errors.city && (
              <div className="complete_shop_profile_error">
                {errors.city}
              </div>
            )}
          </div>

          <div className="complete_shop_profile_field">
            <label>
              Pincode{" "}
              <span className="complete_shop_profile_req">*</span>
            </label>
            <input
              className={`complete_shop_profile_input ${
                errors.pincode ? "has-error" : ""
              }`}
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="110059"
            />
            {errors.pincode && (
              <div className="complete_shop_profile_error">
                {errors.pincode}
              </div>
            )}
          </div>

          <div className="complete_shop_profile_field complete_shop_profile_col_span_2">
            <label>Landmark</label>
            <input
              className="complete_shop_profile_input"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Near metro gate"
            />
          </div>
        </div>

        {/* PHOTO */}
        <div
          className="complete_shop_profile_field"
          style={{ marginTop: 8 }}
        >
          <label>Shop Image</label>
          <div className="complete_shop_profile_upload_box">
            {logoPreview ? (
              <img
                className="complete_shop_profile_preview"
                src={logoPreview}
                alt="shop"
              />
            ) : (
              <div className="complete_shop_profile_upload_hint">
                Upload a shop image (will be uploaded first)
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="complete_shop_profile_file_input"
              onChange={(e) =>
                handleLogoSelect(e.target.files?.[0])
              }
            />
          </div>
        </div>

        {/* HOURS */}
        <h4 style={{ marginTop: 12 }}>Opening Hours</h4>
        <div className="complete_shop_profile_hours_grid">
          {hours.map((h, i) => (
            <div
              key={h.day}
              className="complete_shop_profile_hour_row"
            >
              <div className="complete_shop_profile_hour_day">
                {h.day}
              </div>
              <label className="complete_shop_profile_switch compact">
                <input
                  type="checkbox"
                  checked={h.open}
                  onChange={(e) =>
                    setHourOpen(i, e.target.checked)
                  }
                />
                <span>{h.open ? "Open" : "Closed"}</span>
              </label>
              <input
                type="time"
                className="complete_shop_profile_input"
                disabled={!h.open}
                value={h.from}
                onChange={(e) =>
                  setHourFrom(i, e.target.value)
                }
              />
              <div className="complete_shop_profile_time_sep">
                to
              </div>
              <input
                type="time"
                className="complete_shop_profile_input"
                disabled={!h.open}
                value={h.to}
                onChange={(e) => setHourTo(i, e.target.value)}
              />
            </div>
          ))}
        </div>
        {errors.hours && (
          <div
            className="complete_shop_profile_error"
            style={{ marginTop: 8 }}
          >
            {errors.hours}
          </div>
        )}

        {/* CATALOG */}
        <h4 style={{ marginTop: 12 }}>Items & Services</h4>
        <div className="complete_shop_profile_grid_2">
          {/* Items */}
          <div className="complete_shop_profile_card like-border">
            <div className="complete_shop_profile_card_head">
              <h3 className="complete_shop_profile_card_title">
                Items
              </h3>
              <button
                type="button"
                className="complete_shop_profile_btn complete_shop_profile_btn_primary"
                onClick={addItem}
              >
                + Add Item
              </button>
            </div>
            {items.length === 0 && (
              <div className="complete_shop_profile_empty small">
                No items yet
              </div>
            )}
            {items.map((it, idx) => (
              <div
                key={it.id}
                className="complete_shop_profile_row"
              >
                <input
                  className="complete_shop_profile_input"
                  placeholder={`Item ${idx + 1} name`}
                  value={it.name}
                  onChange={(e) =>
                    updateItem(it.id, { name: e.target.value })
                  }
                />
                <input
                  className="complete_shop_profile_input"
                  placeholder="Price"
                  value={it.price}
                  onChange={(e) =>
                    updateItem(it.id, { price: e.target.value })
                  }
                />
                <input
                  className="complete_shop_profile_input"
                  placeholder="Unit"
                  value={it.unit}
                  onChange={(e) =>
                    updateItem(it.id, { unit: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="complete_shop_profile_btn complete_shop_profile_btn_danger"
                  onClick={() => removeItem(it.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Services */}
          <div className="complete_shop_profile_card like-border">
            <div className="complete_shop_profile_card_head">
              <h3 className="complete_shop_profile_card_title">
                Services
              </h3>
              <button
                type="button"
                className="complete_shop_profile_btn complete_shop_profile_btn_primary"
                onClick={addService}
              >
                + Add Service
              </button>
            </div>
            {services.length === 0 && (
              <div className="complete_shop_profile_empty small">
                No services yet
              </div>
            )}
            {services.map((sv, idx) => (
              <div
                key={sv.id}
                className="complete_shop_profile_row"
              >
                <input
                  className="complete_shop_profile_input"
                  placeholder={`Service ${idx + 1} name`}
                  value={sv.name}
                  onChange={(e) =>
                    updateService(sv.id, {
                      name: e.target.value,
                    })
                  }
                />
                <input
                  className="complete_shop_profile_input"
                  placeholder="Price"
                  value={sv.price}
                  onChange={(e) =>
                    updateService(sv.id, {
                      price: e.target.value,
                    })
                  }
                />
                <input
                  className="complete_shop_profile_input"
                  placeholder="Unit"
                  value={sv.unit}
                  onChange={(e) =>
                    updateService(sv.id, {
                      unit: e.target.value,
                    })
                  }
                />
                <input
                  className="complete_shop_profile_input"
                  placeholder="ETA"
                  value={sv.eta}
                  onChange={(e) =>
                    updateService(sv.id, {
                      eta: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  className="complete_shop_profile_btn complete_shop_profile_btn_danger"
                  onClick={() => removeService(sv.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        {errors.catalog && (
          <div
            className="complete_shop_profile_error"
            style={{ marginTop: 8 }}
          >
            {errors.catalog}
          </div>
        )}

        {/* ACTIONS */}
        <div
          className="complete_shop_profile_actions"
          style={{ marginTop: 16 }}
        >
          <div className="complete_shop_profile_spacer" />
          <button
            type="submit"
            className="complete_shop_profile_btn complete_shop_profile_btn_primary"
            disabled={busy}
          >
            {busy ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </div>
    </form>
  );
}
