import React, { useState, useEffect } from "react";
import API_BASE_URL from "../config/api";
import axios from "axios";

export default function ProfileIcon({ user, onClick }) {
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get profile image from user prop or fetch from API
  useEffect(() => {
    if (!user) {
      setProfileImage(null);
      return;
    }

    const fetchProfileImage = async () => {
      // If user has profilePic or profileImage in prop, use it
      if (user?.profilePic || user?.profileImage) {
        const img = user.profilePic || user.profileImage;
        if (img && img.trim() !== "") {
          setProfileImage(img);
          return;
        }
      }

      // If user has an ID, try to fetch profile from API
      const userId = user?.id || user?._id;
      if (userId && !loading) {
        setLoading(true);
        try {
          const res = await axios.get(`${API_BASE_URL}/profile/${userId}`);
          if (res.data?.profileImage && res.data.profileImage.trim() !== "") {
            setProfileImage(res.data.profileImage);
            // Update localStorage user object with profileImage
            try {
              const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
              if (storedUser && (storedUser.id === userId || storedUser._id === userId)) {
                storedUser.profileImage = res.data.profileImage;
                localStorage.setItem("user", JSON.stringify(storedUser));
              }
            } catch (e) {
              console.warn("Could not update localStorage:", e);
            }
          }
        } catch (err) {
          // Silently fail - will show initial instead
          console.warn("Could not fetch profile image:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfileImage();
  }, [user?.id, user?._id, user?.profilePic, user?.profileImage]);

  const imageUrl = profileImage
    ? `${API_BASE_URL}/profilepics/${profileImage}`
    : null;

  const username = user?.username || "";
  const initial = username?.[0]?.toUpperCase() || "U";

  return (
    <div
      onClick={onClick}
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        cursor: onClick ? "pointer" : "default",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: imageUrl ? "transparent" : "#ff00c8ff",
        color: "#fff",
        fontWeight: "700",
        fontSize: "1.1rem",
        position: "relative",
        flexShrink: 0,
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={username || "Profile"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            // If image fails to load, hide it and show initial
            e.target.style.display = "none";
            e.target.parentElement.style.background = "#ff00c8ff";
          }}
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}

