import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Marketplace.css";
import axiosInstance from "../axiosConfig";

const TABS = ["Jobs", "Buy Requests", "Service Requests", "My Posts"];

export default function Marketplace() {
  const navigate = useNavigate();

  const [tab, setTab] = useState(TABS[0]);
  const [q, setQ] = useState("");

  // View details + apply/quote modal (for Jobs / Buy / Service tabs)
  const [selected, setSelected] = useState(null); // { type, data }

  // Application / quote form state (no name field)
  const [appExpectedPrice, setAppExpectedPrice] = useState("");
  const [appMessage, setAppMessage] = useState("");
  const [isSubmittingApplication, setIsSubmittingApplication] =
    useState(false);

  // Post modal state
  const [postModalType, setPostModalType] = useState(null); // "Jobs" | "Buy Requests" | "Service Requests" | null
  const [postTitle, setPostTitle] = useState("");
  const [postShopName, setPostShopName] = useState("");
  const [postQty, setPostQty] = useState("");
  const [postPrice, setPostPrice] = useState("");
  const [postLocation, setPostLocation] = useState("");
  const [postNotes, setPostNotes] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  // Editing existing post
  const [editingPostId, setEditingPostId] = useState(null); // postId of the post being edited
  const [editingPostBackendType, setEditingPostBackendType] = useState(null); // "JOB" | "BUY" | "SERVICE"

  // ====== PUBLIC DATA (fetched from backend) ======
  const [jobs, setJobs] = useState([]);
  const [buyReqs, setBuyReqs] = useState([]);
  const [svcReqs, setSvcReqs] = useState([]);
  const [isLoadingPublic, setIsLoadingPublic] = useState(false);
  const [publicError, setPublicError] = useState("");

  // My Posts
  const [myPosts, setMyPosts] = useState([]);
  const [isLoadingMyPosts, setIsLoadingMyPosts] = useState(false);
  const [updatingPostId, setUpdatingPostId] = useState(null);

  // My Post details + comments modal
  const [selectedMyPost, setSelectedMyPost] = useState(null); // full post object
  const [myPostComments, setMyPostComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsError, setCommentsError] = useState("");

  // ===== helper for comment date =====
  const formatCommentDate = (raw) => {
    if (!raw) return "";
    // Firestore Timestamp
    if (raw.toMillis) {
      return new Date(raw.toMillis()).toLocaleString("en-IN");
    }
    return new Date(raw).toLocaleString("en-IN");
  };

  // ====== NORMALIZERS FOR BACKEND → UI SHAPE ======
  const normalizeJob = (p) => ({
    id: p.postId || p.id || p.objectID,
    title: p.jobTitle || p.title || "Job",
    shopName: p.shopName || "Unknown Shop",
    wage:
      p.wage !== undefined && p.wage !== null
        ? p.wage
        : p.expectedWage || 0,
    location: p.location || "",
    desc: p.jobDescription || p.description || p.notes || "",
  });

  const normalizeBuy = (p) => ({
    id: p.postId || p.id || p.objectID,
    item: p.itemName || p.item || "Item",
    qty: p.quantity || p.qty || "",
    price:
      p.expectedPrice !== undefined && p.expectedPrice !== null
        ? p.expectedPrice
        : p.offerPrice || 0,
    location: p.location || "",
    notes: p.description || p.notes || "",
  });

  const normalizeService = (p) => ({
    id: p.postId || p.id || p.objectID,
    service: p.serviceName || p.service || "Service",
    price:
      p.budget !== undefined && p.budget !== null ? p.budget : 0,
    location: p.location || "",
    notes: p.description || p.notes || "",
  });

  // ===== FETCH RANDOM PUBLIC POSTS (reusable) =====
  const fetchRandomPublicPosts = useCallback(async () => {
    try {
      setIsLoadingPublic(true);
      setPublicError("");

      const res = await axiosInstance.get(
        "/api/users/protected/marketplace/random",
        { withCredentials: true }
      );

      const data = res?.data || {};
      const jobsRaw = data.jobs || [];
      const servicesRaw = data.services || [];
      const ordersRaw = data.orders || [];

      setJobs(jobsRaw.map(normalizeJob));
      setSvcReqs(servicesRaw.map(normalizeService));
      setBuyReqs(ordersRaw.map(normalizeBuy));
    } catch (err) {
      console.error("Error fetching random marketplace posts:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to load marketplace posts.";
      setPublicError(msg);
    } finally {
      setIsLoadingPublic(false);
    }
  }, []);

  // ===== ON MOUNT: load random public posts =====
  useEffect(() => {
    fetchRandomPublicPosts();
  }, [fetchRandomPublicPosts]);

  // ===== SEARCH HANDLER (Jobs / Buy / Service) =====
  const handleSearch = useCallback(
    async (forceQuery) => {
      // For My Posts, we only do local filtering, no backend search
      if (tab === "My Posts") return;

      const query = (forceQuery ?? q).trim();

      // Empty query → reset to random posts
      if (!query) {
        await fetchRandomPublicPosts();
        return;
      }

      try {
        setIsLoadingPublic(true);
        setPublicError("");

        const res = await axiosInstance.get(
          "/api/users/protected/marketplace/search",
          {
            params: { q: query },
            withCredentials: true,
          }
        );

        const posts = res?.data?.posts || [];

        const jobPosts = posts.filter(
          (p) => String(p.type).toUpperCase() === "JOB"
        );
        const buyPosts = posts.filter(
          (p) => String(p.type).toUpperCase() === "BUY"
        );
        const svcPosts = posts.filter(
          (p) => String(p.type).toUpperCase() === "SERVICE"
        );

        setJobs(jobPosts.map(normalizeJob));
        setBuyReqs(buyPosts.map(normalizeBuy));
        setSvcReqs(svcPosts.map(normalizeService));
      } catch (err) {
        console.error("Error searching marketplace posts:", err);
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to search marketplace posts.";
        setPublicError(msg);
      } finally {
        setIsLoadingPublic(false);
      }
    },
    [q, tab, fetchRandomPublicPosts]
  );

  // Fetch "My Posts" when that tab is selected
  useEffect(() => {
    const fetchMyPosts = async () => {
      if (tab !== "My Posts") return;
      try {
        setIsLoadingMyPosts(true);
        const res = await axiosInstance.get(
          "/api/users/protected/marketplace/my-posts",
          { withCredentials: true }
        );
        const posts = res?.data?.posts || [];
        const normalized = posts.map((p) => ({
          ...p,
          id: p.postId || p.id,
        }));
        setMyPosts(normalized);
      } catch (err) {
        console.error("Error fetching my posts:", err);
      } finally {
        setIsLoadingMyPosts(false);
      }
    };

    fetchMyPosts();
  }, [tab]);

  // ===== LIST FOR CURRENT TAB =====
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const base =
      tab === "Jobs"
        ? jobs
        : tab === "Buy Requests"
          ? buyReqs
          : tab === "Service Requests"
            ? svcReqs
            : myPosts;

    // For My Posts we still do local filtering on q
    if (tab === "My Posts") {
      if (!needle) return base;
      return base.filter((obj) =>
        JSON.stringify(obj).toLowerCase().includes(needle)
      );
    }

    // For public tabs, backend (Algolia) already handled the search
    return base;
  }, [q, tab, jobs, buyReqs, svcReqs, myPosts]);

  // ====== VIEW DETAILS / APPLY MODAL (other tabs) ======
  const openModal = (item) => {
    // For "My Posts", we use a different modal
    if (tab === "My Posts") return;
    setSelected({ type: tab, data: item });
    setAppExpectedPrice("");
    setAppMessage("");
  };

  const closeModal = () => {
    setSelected(null);
    setAppExpectedPrice("");
    setAppMessage("");
    setIsSubmittingApplication(false);
  };

  // >>> Save application/quote as a comment in backend <<<
  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;

    const postId = selected.data.postId || selected.data.id;
    if (!postId) {
      alert("Post ID not found. Please try again.");
      return;
    }

    if (!appMessage.trim() && !appExpectedPrice) {
      alert("Please enter expected price or message.");
      return;
    }

    try {
      setIsSubmittingApplication(true);

      const payload = {
        expectedPrice:
          appExpectedPrice !== "" ? Number(appExpectedPrice) : null,
        message: appMessage,
      };

      await axiosInstance.post(
        `/api/users/protected/marketplace/post/${postId}/comments`,
        payload,
        { withCredentials: true }
      );

      alert("Application / quote submitted successfully.");
      closeModal();
    } catch (err) {
      console.error("Error submitting application / comment:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to submit application.";
      alert(msg);
      setIsSubmittingApplication(false);
    }
  };

  const getPriceLabel = () => {
    if (!selected) return "Expected price (₹)";
    if (selected.type === "Jobs") return "Expected daily/monthly wage (₹)";
    if (selected.type === "Buy Requests") return "Your quote price (₹)";
    if (selected.type === "Service Requests") return "Your service charge (₹)";
    return "Expected price (₹)";
  };

  // ====== POST NEW / EDIT JOB / REQUEST MODAL ======
  const openPostModal = () => {
    if (tab === "My Posts") {
      alert(
        "Select Jobs / Buy Requests / Service Requests tab to create a new post."
      );
      return;
    }
    setPostModalType(tab);
    setPostTitle("");
    setPostShopName("");
    setPostQty("");
    setPostPrice("");
    setPostLocation("");
    setPostNotes("");
    setEditingPostId(null);
    setEditingPostBackendType(null);
  };

  const closePostModal = () => {
    setPostModalType(null);
    setEditingPostId(null);
    setEditingPostBackendType(null);
  };

  const isEditing = Boolean(editingPostId);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!postModalType) return;

    // ---- CREATE / UPDATE JOB ----
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
          location: postLocation,
        };

        let postId;
        if (isEditing && editingPostBackendType === "JOB") {
          // Update job
          payload.postId = editingPostId;
          const res = await axiosInstance.post(
            "/api/users/protected/marketplace/update-post",
            { ...payload, type: "JOB" },
            { withCredentials: true }
          );
          postId = res?.data?.postId || editingPostId;

          // Update in myPosts and jobs lists
          setMyPosts((prev) =>
            prev.map((p) =>
              (p.postId || p.id) === postId
                ? {
                  ...p,
                  jobTitle: postTitle,
                  jobDescription: postNotes,
                  wage: Number(postPrice) || 0,
                  location: postLocation,
                  shopName: postShopName || p.shopName,
                }
                : p
            )
          );
          setJobs((prev) =>
            prev.map((j) =>
              j.id === postId
                ? {
                  ...j,
                  title: postTitle,
                  shopName: postShopName || j.shopName,
                  wage: Number(postPrice) || 0,
                  location: postLocation,
                  desc: postNotes,
                }
                : j
            )
          );
          alert("Job updated successfully.");
        } else {
          // Create new job
          const res = await axiosInstance.post(
            "/api/users/protected/marketplace/post-job",
            payload,
            { withCredentials: true }
          );

          postId = res?.data?.postId || "J" + Date.now();

          const newJob = {
            id: postId,
            title: postTitle,
            shopName: postShopName || "Unknown Shop",
            wage: Number(postPrice) || 0,
            location: postLocation,
            desc: postNotes,
          };

          setJobs((prev) => [...prev, newJob]);
          alert("Job posted successfully.");
        }

        closePostModal();
      } catch (err) {
        console.error("Error posting/updating job:", err);
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to post/update job.";
        alert(msg);
      } finally {
        setIsPosting(false);
      }
      return;
    }

    // ---- CREATE / UPDATE BUY REQUEST ----
    if (postModalType === "Buy Requests") {
      try {
        setIsPosting(true);

        const payload = {
          itemName: postTitle,
          quantity: postQty,
          expectedPrice: postPrice,
          location: postLocation,
          description: postNotes,
        };

        let postId;
        if (isEditing && editingPostBackendType === "BUY") {
          payload.postId = editingPostId;
          const res = await axiosInstance.post(
            "/api/users/protected/marketplace/update-post",
            { ...payload, type: "BUY" },
            { withCredentials: true }
          );
          postId = res?.data?.postId || editingPostId;

          setMyPosts((prev) =>
            prev.map((p) =>
              (p.postId || p.id) === postId
                ? {
                  ...p,
                  itemName: postTitle,
                  quantity: postQty,
                  expectedPrice: Number(postPrice) || 0,
                  location: postLocation,
                  description: postNotes,
                }
                : p
            )
          );
          setBuyReqs((prev) =>
            prev.map((b) =>
              b.id === postId
                ? {
                  ...b,
                  item: postTitle,
                  qty: postQty,
                  price: Number(postPrice) || 0,
                  location: postLocation,
                  notes: postNotes,
                }
                : b
            )
          );
          alert("Buy request updated successfully.");
        } else {
          const res = await axiosInstance.post(
            "/api/users/protected/marketplace/post-buy-request",
            payload,
            { withCredentials: true }
          );

          postId = res?.data?.postId || "B" + Date.now();

          const newBuy = {
            id: postId,
            item: postTitle,
            qty: postQty,
            price: Number(postPrice) || 0,
            location: postLocation,
            notes: postNotes,
          };

          setBuyReqs((prev) => [...prev, newBuy]);
          alert("Buy request posted successfully.");
        }

        closePostModal();
      } catch (err) {
        console.error("Error posting/updating buy request:", err);
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to post/update buy request.";
        alert(msg);
      } finally {
        setIsPosting(false);
      }
      return;
    }

    // ---- CREATE / UPDATE SERVICE REQUEST ----
    if (postModalType === "Service Requests") {
      try {
        setIsPosting(true);

        const payload = {
          serviceName: postTitle,
          budget: postPrice,
          description: postNotes,
          location: postLocation,
        };

        let postId;
        if (isEditing && editingPostBackendType === "SERVICE") {
          payload.postId = editingPostId;
          const res = await axiosInstance.post(
            "/api/users/protected/marketplace/update-post",
            { ...payload, type: "SERVICE" },
            { withCredentials: true }
          );
          postId = res?.data?.postId || editingPostId;

          setMyPosts((prev) =>
            prev.map((p) =>
              (p.postId || p.id) === postId
                ? {
                  ...p,
                  serviceName: postTitle,
                  budget: Number(postPrice) || 0,
                  location: postLocation,
                  description: postNotes,
                }
                : p
            )
          );
          setSvcReqs((prev) =>
            prev.map((s) =>
              s.id === postId
                ? {
                  ...s,
                  service: postTitle,
                  price: Number(postPrice) || 0,
                  location: postLocation,
                  notes: postNotes,
                }
                : s
            )
          );
          alert("Service request updated successfully.");
        } else {
          const res = await axiosInstance.post(
            "/api/users/protected/marketplace/post-service-request",
            payload,
            { withCredentials: true }
          );

          postId = res?.data?.postId || "S" + Date.now();

          const newSvc = {
            id: postId,
            service: postTitle,
            price: Number(postPrice) || 0,
            location: postLocation,
            notes: postNotes,
          };

          setSvcReqs((prev) => [...prev, newSvc]);
          alert("Service request posted successfully.");
        }

        closePostModal();
      } catch (err) {
        console.error("Error posting/updating service request:", err);
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to post/update service request.";
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
    if (tab === "Service Requests") return "Post Service Request";
    return "New Post";
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

  // ====== MY POSTS HELPERS & ACTIONS ======

  const backendTypeToNice = (t) => {
    if (!t) return "Other";
    if (t === "JOB") return "Job";
    if (t === "BUY") return "Buy Request";
    if (t === "SERVICE") return "Service Request";
    return t;
  };

  const getMyPostTitle = (p) => {
    if (p.type === "JOB") return p.jobTitle || p.title || "Job";
    if (p.type === "BUY") return p.itemName || p.item || "Buy Request";
    if (p.type === "SERVICE") return p.serviceName || p.service || "Service Request";
    return p.title || "Post";
  };

  const getMyPostPriceLabel = (p) => {
    if (p.type === "JOB") return p.wage;
    if (p.type === "BUY") return p.expectedPrice;
    if (p.type === "SERVICE") return p.budget;
    return undefined;
  };

  const getMyPostDescription = (p) => {
    return p.jobDescription || p.description || p.notes || "";
  };

  const getMyPostLocation = (p) => p.location || "";

  const handleMarkCompleted = async (post) => {
    const postId = post.postId || post.id;
    if (!postId) return;
    try {
      setUpdatingPostId(postId);
      await axiosInstance.post(
        "/api/users/protected/marketplace/update-post-status",
        { postId, status: "COMPLETED" },
        { withCredentials: true }
      );
      setMyPosts((prev) =>
        prev.map((p) =>
          (p.postId || p.id) === postId ? { ...p, status: "COMPLETED" } : p
        )
      );
      alert("Marked as completed.");
    } catch (err) {
      console.error("Error marking post completed:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to update status.";
      alert(msg);
    } finally {
      setUpdatingPostId(null);
    }
  };

  const handleDeletePost = async (post) => {
    const postId = post.postId || post.id;
    if (!postId) return;
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      setUpdatingPostId(postId);
      await axiosInstance.delete(
        `/api/users/protected/marketplace/post/${postId}`,
        { withCredentials: true }
      );
      setMyPosts((prev) => prev.filter((p) => (p.postId || p.id) !== postId));
      alert("Post deleted.");
    } catch (err) {
      console.error("Error deleting post:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to delete post.";
      alert(msg);
    } finally {
      setUpdatingPostId(null);
    }
  };

  const handleEditPost = (post) => {
    const backendType = post.type; // "JOB" | "BUY" | "SERVICE"
    let modalType;

    if (backendType === "JOB") modalType = "Jobs";
    else if (backendType === "BUY") modalType = "Buy Requests";
    else if (backendType === "SERVICE") modalType = "Service Requests";
    else modalType = "Jobs";

    setPostModalType(modalType);
    setEditingPostId(post.postId || post.id);
    setEditingPostBackendType(backendType);

    // Pre-fill modal fields
    if (backendType === "JOB") {
      setPostTitle(post.jobTitle || post.title || "");
      setPostShopName(post.shopName || "");
      setPostPrice(
        post.wage !== undefined && post.wage !== null ? String(post.wage) : ""
      );
      setPostLocation(post.location || "");
      setPostNotes(post.jobDescription || post.description || post.notes || "");
    } else if (backendType === "BUY") {
      setPostTitle(post.itemName || post.item || "");
      setPostQty(post.quantity || post.qty || "");
      setPostPrice(
        post.expectedPrice !== undefined && post.expectedPrice !== null
          ? String(post.expectedPrice)
          : ""
      );
      setPostLocation(post.location || "");
      setPostNotes(post.description || post.notes || "");
    } else if (backendType === "SERVICE") {
      setPostTitle(post.serviceName || post.service || "");
      setPostPrice(
        post.budget !== undefined && post.budget !== null
          ? String(post.budget)
          : ""
      );
      setPostLocation(post.location || "");
      setPostNotes(post.description || post.notes || "");
    }
  };

  // ===== MY POST DETAILS + COMMENTS =====

  const fetchCommentsForPost = async (postId) => {
    setLoadingComments(true);
    setCommentsError("");
    setMyPostComments([]);

    try {
      const res = await axiosInstance.get(
        `/api/users/protected/marketplace/post/${postId}/comments`,
        { withCredentials: true }
      );
      setMyPostComments(res?.data?.comments || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to load comments.";
      setCommentsError(msg);
    } finally {
      setLoadingComments(false);
    }
  };

  const openMyPostModal = (post) => {
    if (!post) return;
    const postId = post.postId || post.id;
    setSelectedMyPost({ ...post, postId });
    fetchCommentsForPost(postId);
  };

  const closeMyPostModal = () => {
    setSelectedMyPost(null);
    setMyPostComments([]);
    setCommentsError("");
  };

  const handleCommentUserClick = (userId) => {
    if (!userId) return;
    // Adjust this route if your profile-view page is different
    navigate(`/app/profile-view/${userId}`);
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
                className={`market_place_tab ${t === tab ? "market_place_tab_active" : ""
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
              placeholder={
                tab === "My Posts"
                  ? "Search my posts…"
                  : `Search ${tab.toLowerCase()}…`
              }
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            {tab !== "My Posts" && (
              <button
                className="market_place_post_button"
                onClick={openPostModal}
              >
                {getPostButtonLabel()}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========== LISTS FOR PUBLIC TABS ========== */}
      {tab !== "My Posts" && (
        <div className="market_place_grid">
          {isLoadingPublic && (
            <div className="market_place_empty">
              Loading marketplace posts…
            </div>
          )}

          {!isLoadingPublic && publicError && (
            <div className="market_place_empty">{publicError}</div>
          )}

          {!isLoadingPublic &&
            !publicError &&
            list.map((item) => (
              <div
                className="market_place_card"
                key={item.id}
                onClick={() => openModal(item)}
              >
                {tab === "Jobs" && (
                  <>
                    <div className="market_place_card_head">
                      <h3 className="market_place_card_title">
                        {item.title}
                      </h3>
                      <span className="market_place_tag">
                        ₹{item.wage}/day
                      </span>
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
                      <h3 className="market_place_card_title">
                        {item.item}
                      </h3>
                      <span className="market_place_tag">
                        Qty: {item.qty}
                      </span>
                    </div>
                    <div className="market_place_row">
                      <span className="market_place_label">Offer:</span>{" "}
                      <span>₹{item.price}</span>
                    </div>
                    <div className="market_place_row">
                      <span className="market_place_label">
                        Location:
                      </span>{" "}
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
                      <h3 className="market_place_card_title">
                        {item.service}
                      </h3>
                      <span className="market_place_tag">
                        Budget: ₹{item.price}
                      </span>
                    </div>
                    <div className="market_place_row">
                      <span className="market_place_label">
                        Location:
                      </span>{" "}
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

          {!isLoadingPublic && !publicError && list.length === 0 && (
            <div className="market_place_empty">
              Nothing here yet. Be the first to post!
            </div>
          )}
        </div>
      )}

      {/* ===== MY POSTS TAB ===== */}
      {tab === "My Posts" && (
        <div className="market_place_grid">
          {isLoadingMyPosts && (
            <div className="market_place_empty">Loading your posts…</div>
          )}

          {!isLoadingMyPosts && list.length === 0 && (
            <div className="market_place_empty">
              You haven't posted anything yet.
            </div>
          )}

          {!isLoadingMyPosts &&
            list.map((post) => {
              const postId = post.postId || post.id;
              const title = getMyPostTitle(post);
              const price = getMyPostPriceLabel(post);
              const location = getMyPostLocation(post);
              const desc = getMyPostDescription(post);
              const typeNice = backendTypeToNice(post.type);
              const status = post.status || "ACTIVE";

              return (
                <div
                  className="market_place_card"
                  key={postId}
                  onClick={() => openMyPostModal(post)}
                >
                  <div className="market_place_card_head">
                    <h3 className="market_place_card_title">{title}</h3>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span className="market_place_tag">{typeNice}</span>
                      <span className="market_place_tag">
                        {status === "COMPLETED" ? "Completed" : status}
                      </span>
                    </div>
                  </div>

                  {price !== undefined && price !== null && (
                    <div className="market_place_row">
                      <span className="market_place_label">
                        {post.type === "JOB"
                          ? "Wage / salary:"
                          : post.type === "BUY"
                            ? "Budget / offer:"
                            : "Budget:"}
                      </span>{" "}
                      <span>₹{price}</span>
                    </div>
                  )}

                  {location && (
                    <div className="market_place_row">
                      <span className="market_place_label">Location:</span>{" "}
                      <span>{location}</span>
                    </div>
                  )}

                  {desc && (
                    <p className="market_place_text">
                      {desc.length > 160 ? desc.slice(0, 160) + "…" : desc}
                    </p>
                  )}

                  <div
                    className="market_place_card_footer"
                    style={{ justifyContent: "space-between" }}
                  >
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="market_place_btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPost(post);
                        }}
                        disabled={updatingPostId === postId}
                      >
                        Edit
                      </button>
                      <button
                        className="market_place_btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkCompleted(post);
                        }}
                        disabled={updatingPostId === postId}
                      >
                        {status === "COMPLETED"
                          ? "Completed"
                          : "Mark Completed"}
                      </button>
                    </div>
                    <button
                      className="market_place_btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePost(post);
                      }}
                      disabled={updatingPostId === postId}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* ========== VIEW DETAILS + APPLICATION / QUOTE MODAL (Jobs / Buy / Service) ========== */}
      {selected && (
        <div className="market_place_modal_overlay" onClick={closeModal}>
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
                  <span className="market_place_modal_label">
                    Location:
                  </span>{" "}
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
                  <span className="market_place_modal_label">
                    Buyer offer:
                  </span>{" "}
                  ₹{selected.data.price}
                </p>
                <p className="market_place_modal_row">
                  <span className="market_place_modal_label">
                    Location:
                  </span>{" "}
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
                  <span className="market_place_modal_label">
                    Location:
                  </span>{" "}
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
                  disabled={isSubmittingApplication}
                >
                  {isSubmittingApplication
                    ? "Submitting..."
                    : selected.type === "Jobs"
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

      {/* ========== MY POST DETAILS + COMMENTS MODAL ========== */}
      {selectedMyPost && (
        <div
          className="market_place_modal_overlay"
          onClick={closeMyPostModal}
        >
          <div
            className="market_place_modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="market_place_modal_close"
              onClick={closeMyPostModal}
            >
              ✕
            </button>

            {/* Post details depending on type */}
            {selectedMyPost.type === "JOB" && (
              <>
                <h2 className="market_place_modal_title">
                  {selectedMyPost.jobTitle}
                </h2>
                <p className="market_place_modal_highlight">
                  Wage: ₹{selectedMyPost.wage}
                </p>
                <p className="market_place_modal_row">
                  <span className="market_place_modal_label">Shop:</span>{" "}
                  {selectedMyPost.shopName || "—"}
                </p>
                <p className="market_place_modal_row">
                  <span className="market_place_modal_label">
                    Location:
                  </span>{" "}
                  {selectedMyPost.location || "—"}
                </p>
                <p className="market_place_modal_description">
                  {selectedMyPost.jobDescription}
                </p>
              </>
            )}

            {(selectedMyPost.type === "BUY" ||
              selectedMyPost.type === "BUY_REQUEST") && (
                <>
                  <h2 className="market_place_modal_title">
                    {selectedMyPost.itemName}
                  </h2>
                  <p className="market_place_modal_highlight">
                    Quantity: {selectedMyPost.quantity}
                  </p>
                  <p className="market_place_modal_row">
                    <span className="market_place_modal_label">
                      Expected price:
                    </span>{" "}
                    {selectedMyPost.expectedPrice
                      ? `₹${selectedMyPost.expectedPrice}`
                      : "—"}
                  </p>
                  <p className="market_place_modal_row">
                    <span className="market_place_modal_label">
                      Location:
                    </span>{" "}
                    {selectedMyPost.location || "—"}
                  </p>
                  <p className="market_place_modal_description">
                    {selectedMyPost.description}
                  </p>
                </>
              )}

            {(selectedMyPost.type === "SERVICE" ||
              selectedMyPost.type === "SERVICE_REQUEST") && (
                <>
                  <h2 className="market_place_modal_title">
                    {selectedMyPost.serviceName}
                  </h2>
                  <p className="market_place_modal_highlight">
                    Budget:{" "}
                    {selectedMyPost.budget
                      ? `₹${selectedMyPost.budget}`
                      : "Not specified"}
                  </p>
                  <p className="market_place_modal_row">
                    <span className="market_place_modal_label">
                      Location:
                    </span>{" "}
                    {selectedMyPost.location || "—"}
                  </p>
                  <p className="market_place_modal_description">
                    {selectedMyPost.description}
                  </p>
                </>
              )}

            {/* STATUS */}
            <p className="market_place_modal_row">
              <span className="market_place_modal_label">Status:</span>{" "}
              {selectedMyPost.status || "ACTIVE"}
            </p>

            {/* COMMENTS SECTION */}
            <div className="market_place_comments_section">
              <h3 className="market_place_form_title">Comments</h3>

              {loadingComments && <p>Loading comments…</p>}

              {!loadingComments && commentsError && (
                <p className="market_place_error_text">{commentsError}</p>
              )}

              {!loadingComments &&
                !commentsError &&
                myPostComments.length === 0 && <p>No comments yet.</p>}

              {!loadingComments &&
                !commentsError &&
                myPostComments.length > 0 && (
                  <div className="market_place_comments_list">
                    {myPostComments.map((c) => (
                      <div
                        key={c.id}
                        className="market_place_comment_item"
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          marginBottom: 10,
                        }}
                      >
                        <div
                          className="market_place_comment_avatar"
                          onClick={() => handleCommentUserClick(c.commenterId)}
                          title="View profile"
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            overflow: "hidden",
                            flexShrink: 0,
                            border: "1px solid #ddd",
                            cursor: "pointer",
                          }}
                        >
                          <img
                            src={
                              c.avatarUrl ||
                              c.commenterAvatarUrl ||
                              "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?w=1060"
                            }
                            alt={c.commenterName || "User"}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        </div>

                        <div className="market_place_comment_body" style={{ flex: 1 }}>
                          <div
                            className="market_place_comment_header"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 2,
                            }}
                          >
                            <span className="market_place_comment_name">
                              {c.commenterName || "Unknown"}
                            </span>
                            <span
                              className="market_place_comment_date"
                              style={{ fontSize: 12, opacity: 0.7 }}
                            >
                              {formatCommentDate(c.createdAt)}
                            </span>
                          </div>
                          <p
                            className="market_place_comment_text"
                            style={{ fontSize: 14, margin: 0 }}
                          >
                            {c.expectedPrice ? `Expected: ₹${c.expectedPrice} - ` : ""}
                            {c.text || c.message}
                          </p>
                        </div>
                      </div>
                    ))}

                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* ========== POST NEW / EDIT JOB / REQUEST MODAL ========== */}
      {postModalType && (
        <div className="market_place_modal_overlay" onClick={closePostModal}>
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
                ? isEditing
                  ? "Edit Job"
                  : "Post a Job"
                : postModalType === "Buy Requests"
                  ? isEditing
                    ? "Edit Buy Request"
                    : "Post a Buy Request"
                  : isEditing
                    ? "Edit Service Request"
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
                    ? isEditing
                      ? "Saving..."
                      : "Posting..."
                    : isEditing
                      ? "Save Changes"
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
