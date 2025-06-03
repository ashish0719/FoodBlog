import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileDropdown({
  user,
  isLogin,
  onLogout,
  onLoginClick,
  onClose,
}) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div ref={dropdownRef} style={styles.container}>
      <ul style={styles.ul}>
        <li
          style={styles.dropdownItem}
          onClick={() => {
            onClose();
            navigate("/profile");
          }}
        >
          Profile
        </li>
        <li
          style={styles.dropdownItem}
          onClick={() => {
            onClose();
            if (isLogin) {
              onLoginClick();
            } else {
              onLogout();
            }
          }}
        >
          {isLogin ? "Login" : "Logout"}
        </li>
        <li
          style={styles.dropdownItem}
          onClick={() => {
            onClose();
            if (!isLogin) navigate("/favRecipe");
            else onLoginClick();
          }}
        >
          Favorites
        </li>
        <li
          style={styles.dropdownItem}
          onClick={() => {
            onClose();
            navigate("/likedPosts");
          }}
        >
          Liked Posts
        </li>
      </ul>
    </div>
  );
}

const styles = {
  container: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "#fff",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderRadius: "12px",
    padding: "0.5rem 0",
    zIndex: 1000,
    minWidth: 160,

    border: "3px solid #007BFF",
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  ul: {
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  dropdownItem: {
    padding: "0.5rem 1.2rem",
    cursor: "pointer",
    whiteSpace: "nowrap",
    color: "black",
    fontWeight: "700",
    transition: "background 0.3s ease",
  },
};
