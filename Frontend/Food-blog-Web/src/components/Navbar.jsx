import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import InputForm from "./Forms";
import { NavLink, useNavigate } from "react-router-dom";
import ProfileIcon from "./ProfileIcon";
import CircularFloatingMenu from "./CircularFloatingMenu";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isLogin, setIsLogin] = useState(!token);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  // Update login state when token changes
  useEffect(() => {
    setIsLogin(!token);
  }, [token]);

  // Auto-update user when storage changes (e.g. image upload)
  useEffect(() => {
    const updateUser = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUser(updatedUser);
    };
    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setIsLogin(true);
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <>
      <header style={styles.header}>
        <h2 style={styles.logo}>The Indian Bawarchi</h2>

        <ul style={styles.navList}>
          <li>
            <NavLink
              to="/"
              style={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to={isLogin ? "/" : "/myRecipe"}
              onClick={() => isLogin && setIsOpen(true)}
              style={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }
            >
              My Recipe
            </NavLink>
          </li>

          <li>
            <NavLink
              to={isLogin ? "/" : "/favRecipe"}
              onClick={() => isLogin && setIsOpen(true)}
              style={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }
            >
              Favourites
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/blogs"
              style={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }
            >
              Blogs
            </NavLink>
          </li>

          {/* Only show "Users" when logged in */}
          {!isLogin && (
            <li>
              <NavLink
                to="/users"
                style={({ isActive }) =>
                  isActive ? styles.activeLink : styles.navLink
                }
              >
                Users
              </NavLink>
            </li>
          )}

          {/* Profile Icon + Circular Floating Menu */}
          <li style={{ position: "relative", overflow: "visible" }}>
            <ProfileIcon
              user={user}
              onClick={() => setDropdownOpen((o) => !o)}
            />

            <CircularFloatingMenu
              isOpen={dropdownOpen}
              user={user}
              isLogin={isLogin}
              onLogout={logout}
              onLoginClick={() => setIsOpen(true)}
              onClose={() => setDropdownOpen(false)}
            />
          </li>
        </ul>
      </header>

      {/* LOGIN MODAL */}
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm
            setIsOpen={() => setIsOpen(false)}
            setToken={setToken}
            setUser={setUser}
          />
        </Modal>
      )}
    </>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 2rem",
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    overflow: "visible", // Allow menu to overflow header
    width: "100%",
    margin: 0,
    boxSizing: "border-box",
    // Override global header styles
    height: "auto",
  },
  logo: {
    fontWeight: "700",
    fontSize: "1.5rem",
  },
  navList: {
    listStyle: "none",
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
    margin: 0,
    padding: 0,
    overflow: "visible", // Allow menu to overflow
  },
  navLink: {
    textDecoration: "none",
    color: "#444",
    fontWeight: "500",
    paddingBottom: "3px",
    borderBottom: "3px solid transparent",
    transition: "0.3s",
  },
  activeLink: {
    textDecoration: "none",
    color: "#007BFF",
    fontWeight: "700",
    borderBottom: "3px solid #007BFF",
    paddingBottom: "3px",
  },
};
