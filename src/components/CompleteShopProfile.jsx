import React, { useState, useEffect } from "react";
import axios from "axios";
import './CompleteShopProfile.css';

export default function CompleteShopProfile() {
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [itemsInput, setItemsInput] = useState("");
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [paymentMethods, setPaymentMethods] = useState({ cash: true, upi: true, card: false });
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Categories - tweak as needed
  const CATEGORIES = [
    "General Store",
    "Grocery",
    "Food / Restaurant",
    "Electronics",
    "Clothing",
    "Construction",
    "Plumbing",
    "Electrical",
    "Salon / Beauty",
    "Repair / Services",
    "Other",
  ];

  useEffect(() => {
    // Try to extract phone from token if present (safe guard)
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const parts = token.split(".");
      if (parts.length < 2) return;
      const payload = JSON.parse(atob(parts[1]));
      if (payload) {
        if (payload.phone) setPhone(payload.phone);
        if (payload.name) setName(payload.name);
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  function handleAddItem() {
    const v = itemsInput.trim();
    if (!v) return;
    if (items.includes(v)) {
      setItemsInput("");
      return;
    }
    setItems(prev => [...prev, v]);
    setItemsInput("");
  }

  function handleRemoveItem(item) {
    setItems(prev => prev.filter(i => i !== item));
  }

  function handleImageChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  function useBrowserLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setError(null);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLatitude(pos.coords.latitude.toString());
        setLongitude(pos.coords.longitude.toString());
      },
      err => setError("Unable to fetch location: " + err.message),
      { timeout: 10000 }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!shopName.trim()) return setError("Shop name is required");
    if (!name.trim()) return setError("Owner name is required");

    setLoading(true);
    try {
      const form = new FormData();
      form.append("phone", phone || "");
      form.append("name", name);
      form.append("shopName", shopName);
      form.append("address", address);
      form.append("category", category);
      form.append("items", JSON.stringify(items));
      form.append("latitude", latitude);
      form.append("longitude", longitude);
      form.append("openingHours", openingHours);
      form.append("paymentMethods", JSON.stringify(paymentMethods));
      form.append("description", description);
      if (imageFile) form.append("image", imageFile);

      const token = localStorage.getItem("token");

      const resp = await axios.post("/api/shops/complete-profile", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      if (resp.data && resp.data.success) {
        setSuccessMessage("Profile completed successfully. Redirecting...");
        // redirect to dashboard (or use redirectUrl from API if returned)
        const redirect = resp.data.redirectUrl || "/dashboard-shops";
        setTimeout(() => {
          window.location.href = redirect;
        }, 1000);
      } else {
        setError(resp.data?.message || "Unknown error from server");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="complete-shop-profile max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Complete your shop profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* Owner name */}
        <div>
          <label className="block text-sm font-medium">Owner / Contact Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2"
            placeholder="e.g. Rajesh Kumar"
          />
        </div>

        {/* Phone (readonly if available) */}
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2 bg-gray-50"
            placeholder="Phone number"
          />
        </div>

        {/* Shop name */}
        <div>
          <label className="block text-sm font-medium">Shop name</label>
          <input
            value={shopName}
            onChange={e => setShopName(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2"
            placeholder="e.g. Kumar General Store"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2"
          >
            <option value="">Select category</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Items sold (tags) */}
        <div>
          <label className="block text-sm font-medium">Items / Services (add multiple)</label>
          <div className="flex gap-2 mt-2">
            <input
              value={itemsInput}
              onChange={e => setItemsInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddItem();
                }
              }}
              className="flex-1 rounded border px-3 py-2"
              placeholder="Type an item and press Enter or click Add"
            />
            <button
              type="button"
              onClick={handleAddItem}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              Add
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {items.map(it => (
              <div key={it} className="px-3 py-1 rounded-full bg-gray-100 flex items-center gap-2">
                <span className="text-sm">{it}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(it)}
                  className="text-xs text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium">Shop Image</label>
          <div className="mt-2 flex items-center gap-4">
            <div className="w-36 h-24 border rounded overflow-hidden flex items-center justify-center bg-gray-50">
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="object-cover w-full h-full" />
              ) : (
                <span className="text-xs text-gray-400">No image</span>
              )}
            </div>
            <div>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <div className="text-xs text-gray-500 mt-1">Recommended: clear photo of shop frontage</div>
            </div>
          </div>
        </div>

        {/* Address & location */}
        <div>
          <label className="block text-sm font-medium">Address</label>
          <input
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2"
            placeholder="Full address, landmark, city"
          />
          <div className="mt-2 flex items-center gap-2">
            <input
              value={latitude}
              onChange={e => setLatitude(e.target.value)}
              className="rounded border px-2 py-1 w-32"
              placeholder="lat"
            />
            <input
              value={longitude}
              onChange={e => setLongitude(e.target.value)}
              className="rounded border px-2 py-1 w-32"
              placeholder="lng"
            />
            <button type="button" onClick={useBrowserLocation} className="px-3 py-1 rounded bg-gray-200">
              Use my location
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1">Latitude/Longitude optional — helps show precise location on map</div>
        </div>

        {/* Opening hours, payment methods, description */}
        <div>
          <label className="block text-sm font-medium">Opening hours (optional)</label>
          <input
            value={openingHours}
            onChange={e => setOpeningHours(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2"
            placeholder="e.g. 9:00 AM - 9:00 PM"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Payment methods</label>
          <div className="mt-2 flex gap-4 items-center">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={paymentMethods.cash} onChange={e => setPaymentMethods(prev => ({...prev, cash: e.target.checked}))} />
              <span className="text-sm">Cash</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={paymentMethods.upi} onChange={e => setPaymentMethods(prev => ({...prev, upi: e.target.checked}))} />
              <span className="text-sm">UPI</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={paymentMethods.card} onChange={e => setPaymentMethods(prev => ({...prev, card: e.target.checked}))} />
              <span className="text-sm">Card</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Short description (what makes your shop special)</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2"
            rows={4}
            placeholder="A short description visitors will see"
          />
        </div>

        {/* Buttons & messages */}
        <div className="flex items-center justify-between">
          <div>
            {error && <div className="text-sm text-red-500">{error}</div>}
            {successMessage && <div className="text-sm text-green-600">{successMessage}</div>}
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => window.history.back()} className="px-4 py-2 border rounded">Back</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-green-600 text-white">
              {loading ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6 text-xs text-gray-500">
        Tip: Add clear shop images and accurate address to get more views from customers.
      </div>
    </div>
  );
}
