import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CircularFloatingMenu({
  isOpen,
  onClose,
  user,
  isLogin,
  onLogout,
  onLoginClick,
}) {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    {
      id: "profile",
      label: "Profile",
      icon: "👤",
      action: () => {
        onClose();
        navigate("/profile");
      },
      show: true,
    },
    {
      id: "favorites",
      label: "Favorites",
      icon: "❤️",
      action: () => {
        onClose();
        if (!isLogin) navigate("/favRecipe");
        else onLoginClick();
      },
      show: true,
    },
    {
      id: "liked",
      label: "Liked Posts",
      icon: "👍",
      action: () => {
        onClose();
        navigate("/likedPosts");
      },
      show: true,
    },
    {
      id: "auth",
      label: isLogin ? "Login" : "Logout",
      icon: isLogin ? "🔐" : "🚪",
      action: () => {
        onClose();
        if (isLogin) {
          onLoginClick();
        } else {
          onLogout();
        }
      },
      show: true,
    },
  ];

  // Calculate positions for circular menu
  const radius = 80; // Distance from center
  const centerX = 0;
  const centerY = 0;
  const angleStep = (2 * Math.PI) / menuItems.length;

  return (
    <div
      ref={menuRef}
      className="circular-menu-container"
      style={{
        position: "absolute",
        top: "calc(100% + 10px)",
        right: 0,
        width: radius * 2 + 60,
        height: radius * 2 + 60,
        zIndex: 1000,
        pointerEvents: "auto",
        margin: 0,
        padding: 0,
        // Ensure it doesn't affect layout - completely out of document flow
        transform: "translateX(0)",
        overflow: "visible",
        // Prevent any layout impact
        boxSizing: "border-box",
        isolation: "isolate", // Create new stacking context
      }}
    >
      {/* Menu Items in Circle */}
      {menuItems.map((item, index) => {
        const angle = index * angleStep - Math.PI / 2; // Start from top
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        return (
          <button
            key={item.id}
            className="circular-menu-item"
            onClick={item.action}
            style={{
              position: "absolute",
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "3px solid white",
              color: "white",
              fontSize: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
              zIndex: 1001,
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translate(-50%, -50%) scale(1.15)";
              e.target.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translate(-50%, -50%) scale(1)";
              e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
            }}
            title={item.label}
          >
            {item.icon}
          </button>
        );
      })}

      {/* Tooltip/Label on Hover */}
      <style>{`
        .circular-menu-item:hover::after {
          content: attr(title);
          position: absolute;
          bottom: -35px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

