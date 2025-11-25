import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import "./ViewProfile.css";

export default function ViewProfile() {
  const { profileId } = useParams(); // from /app/profile-view/:profileId
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // contact reveal state
  const [contact, setContact] = useState({ phone: null, whatsapp: null });
  const [isRevealingContact, setIsRevealingContact] = useState(false);
  const [contactError, setContactError] = useState("");

  // Fetch profile (user or shop) from backend
  useEffect(() => {
    if (!profileId) return;

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError("");

        const res = await axiosInstance.get(
          `/api/users/protected/profile-view/${profileId}`,
          { withCredentials: true }
        );

        const data = res?.data?.profile || res?.data;
        setProfile(data || null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load profile.";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  const handleBack = () => {
    // go back to previous page or to /app/marketplace as fallback
    if (window.history.length > 1) navigate(-1);
    else navigate("/app/marketplace");
  };

  const handleViewContact = async () => {
    try {
      setIsRevealingContact(true);
      setContactError("");

      const res = await axiosInstance.post(
        `/api/users/protected/profile-view/${profileId}/reveal-contact`,
        {},
        { withCredentials: true }
      );

      const data = res?.data || {};
      setContact({
        phone: data.phone || null,
        whatsapp: data.whatsapp || null,
      });
    } catch (err) {
      console.error("Error revealing contact:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to reveal contact details.";
      setContactError(msg);
      alert(msg);
    } finally {
      setIsRevealingContact(false);
    }
  };

  // helpers to normalize shape a bit
  const isShop =
    profile && (profile.type === "SHOP" || profile.accountType === "SHOP");

  const displayName = isShop
    ? profile?.shopName || profile?.name || "Shop"
    : profile?.name || profile?.fullName || "User";

  const avatarUrl =
    profile?.avatarUrl ||
    profile?.profileImageUrl ||
    profile?.profileImage ||
    profile?.photoURL ||
    null;

  const location =
    profile?.location ||
    [profile?.area, profile?.city, profile?.pincode].filter(Boolean).join(", ");

  const skills =
    (Array.isArray(profile?.skills) && profile.skills) ||
    (typeof profile?.skills === "string"
      ? profile.skills.split(",").map((s) => s.trim())
      : []);

  const about =
    profile?.about ||
    profile?.bio ||
    (isShop ? profile?.description : "") ||
    "";

  const rating = profile?.rating || profile?.avgRating;
  const totalReviews = profile?.totalReviews || profile?.reviewsCount;

  const hasContactInfo = !!(profile?.phone || profile?.whatsapp);

  return (
    <div className="profile_view_page">
      <div className="profile_view_header">
        <button
          className="profile_view_back_btn"
          onClick={handleBack}
        >
          Back
        </button>
        <h2 className="profile_view_title">
          {isShop ? "Shop Profile" : "Worker Profile"}
        </h2>
      </div>

      {isLoading && (
        <div className="profile_view_state">Loading profile…</div>
      )}

      {!isLoading && error && (
        <div className="profile_view_state profile_view_error">{error}</div>
      )}

      {!isLoading && !error && !profile && (
        <div className="profile_view_state">Profile not found.</div>
      )}

      {!isLoading && !error && profile && (
        <div className="profile_view_card">
          {/* Avatar + name row */}
          <div className="profile_view_top">
            <div className="profile_view_avatar_wrapper">
              <div className="profile_view_avatar">
                <img
                  src={
                    avatarUrl ||
                    "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?w=1060"
                  }
                  alt={displayName}
                />
              </div>
            </div>

            <div className="profile_view_basic">
              <h1 className="profile_view_name">{displayName}</h1>
              {isShop && (
                <div className="profile_view_badge profile_view_badge_shop">
                  Shop
                </div>
              )}
              {!isShop && (
                <div className="profile_view_badge profile_view_badge_user">
                  Worker
                </div>
              )}

              {location && (
                <p className="profile_view_location">
                  <span role="img" aria-label="location">
                    📍
                  </span>{" "}
                  {location}
                </p>
              )}

              {(rating || totalReviews) && (
                <p className="profile_view_rating">
                  ⭐{" "}
                  {rating
                    ? rating.toFixed
                      ? rating.toFixed(1)
                      : rating
                    : "—"}{" "}
                  {totalReviews ? `(${totalReviews} reviews)` : ""}
                </p>
              )}
            </div>
          </div>

          {/* Details sections */}
          <div className="profile_view_sections">
            {/* Skills / Category */}
            {(skills && skills.length > 0) || profile?.category ? (
              <div className="profile_view_section">
                <h3 className="profile_view_section_title">
                  {isShop ? "Category / Services" : "Skills"}
                </h3>
                <div className="profile_view_tags">
                  {profile?.category && (
                    <span className="profile_view_tag">
                      {profile.category}
                    </span>
                  )}
                  {skills.map((skill) => (
                    <span key={skill} className="profile_view_tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* About */}
            {about && (
              <div className="profile_view_section">
                <h3 className="profile_view_section_title">About</h3>
                <p className="profile_view_text">{about}</p>
              </div>
            )}

            {/* Contact info (hidden behind paywall) */}
            {hasContactInfo && (
              <div className="profile_view_section">
                <h3 className="profile_view_section_title">Contact</h3>

                {contact.phone || contact.whatsapp ? (
                  <>
                    {contact.phone && (
                      <p className="profile_view_text">
                        Phone:{" "}
                        <span className="profile_view_contact_value">
                          {contact.phone}
                        </span>
                      </p>
                    )}
                    {contact.whatsapp && (
                      <p className="profile_view_text">
                        WhatsApp:{" "}
                        <span className="profile_view_contact_value">
                          {contact.whatsapp}
                        </span>
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="profile_view_text">
                      Contact details are hidden. Pay ₹15 to view full contact
                      details for this profile.
                    </p>
                    {contactError && (
                      <p className="profile_view_error_text">
                        {contactError}
                      </p>
                    )}
                    <button
                      className="profile_view_contact_btn"
                      onClick={handleViewContact}
                      disabled={isRevealingContact}
                    >
                      {isRevealingContact
                        ? "Processing…"
                        : "View Contact (₹15)"}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Extra info */}
            {(profile?.experienceYears ||
              profile?.experience ||
              profile?.timings ||
              profile?.openingTime ||
              profile?.closingTime) && (
              <div className="profile_view_section">
                <h3 className="profile_view_section_title">Details</h3>
                {profile?.experienceYears && (
                  <p className="profile_view_text">
                    Experience: {profile.experienceYears} years
                  </p>
                )}
                {profile?.experience && (
                  <p className="profile_view_text">
                    Experience: {profile.experience}
                  </p>
                )}
                {(profile?.timings ||
                  profile?.openingTime ||
                  profile?.closingTime) && (
                  <p className="profile_view_text">
                    Timings:{" "}
                    {profile?.timings ||
                      `${profile?.openingTime || ""} - ${
                        profile?.closingTime || ""
                      }`}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
