import React from "react";

export default function ProfileIcon({ user, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        backgroundColor: "#007BFF",
        color: "#fff",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
        fontWeight: "700",
        fontSize: "1.1rem",
      }}
      title={user?.username || "User"}
    >
      {user?.profilePic ? (
        <img
          src={user.profilePic}
          alt="Profile"
          style={{ width: "100%", height: "100%", borderRadius: "50%" }}
        />
      ) : (
        <>{user?.username?.[0]?.toUpperCase() || "U"}</>
      )}
    </div>
  );
}
