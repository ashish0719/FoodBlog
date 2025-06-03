// import React, { useEffect, useState } from "react";
// import Modal from "./Modal";
// import InputForm from "./Forms"; // Make sure your file is named Forms.jsx

// import { NavLink, useNavigate } from "react-router-dom";

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
//   const [isLogin, setIsLogin] = useState(!token);

//   useEffect(() => {
//     setIsLogin(!token);
//   }, [token]);

//   const navigate = useNavigate();
//   const checkLogin = () => {
//     if (token) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       setToken(null); // 🧼 Clear token state
//       setUser(null); // 🧼 Clear user state
//       setIsLogin(true);
//       navigate("/"); // 🚀 Redirect to home after logout
//     } else {
//       setIsOpen(true);
//     }
//   };

//   return (
//     <>
//       <header>
//         <h2>Food Blog</h2>
//         <ul>
//           <li>
//             <NavLink to="/">Home</NavLink>
//           </li>
//           <li onClick={() => isLogin && setIsOpen(true)}>
//             <NavLink to={!isLogin ? "/myRecipe" : "/"}>My Recipe</NavLink>
//           </li>
//           <li onClick={() => isLogin && setIsOpen(true)}>
//             <NavLink to={!isLogin ? "/favRecipe" : "/"}>Favourites</NavLink>
//           </li>
//           <li onClick={checkLogin}>
//             <p className="login">
//               {isLogin ? "Login" : "Logout"}
//               {user?.email ? ` (${user.username})` : ""}
//             </p>
//           </li>
//         </ul>
//       </header>
//       {isOpen && (
//         <Modal onClose={() => setIsOpen(false)}>
//           <InputForm
//             setIsOpen={() => setIsOpen(false)}
//             setToken={setToken}
//             setUser={setUser}
//           />
//         </Modal>
//       )}
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import InputForm from "./Forms";
import { NavLink, useNavigate } from "react-router-dom";
import ProfileIcon from "./ProfileIcon";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isLogin, setIsLogin] = useState(!token);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLogin(!token);
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsLogin(true);
    setDropdownOpen(false);
    navigate("/");
  };

  const handleLoginClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <header style={styles.header}>
        <h2>Food Blog</h2>
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

          <li style={{ position: "relative" }}>
            <ProfileIcon
              user={user}
              onClick={() => setDropdownOpen((open) => !open)}
            />
            {dropdownOpen && (
              <ProfileDropdown
                user={user}
                isLogin={isLogin}
                onLogout={logout}
                onLoginClick={handleLoginClick}
                onClose={() => setDropdownOpen(false)}
              />
            )}
            <h4>{user.username}</h4>
          </li>
        </ul>
      </header>

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
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  navList: {
    listStyle: "none",
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
    margin: 0,
    padding: 0,
  },
  navLink: {
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
    paddingBottom: "3px",
    borderBottom: "3px solid transparent",
    transition: "border-bottom-color 0.3s ease",
  },
  activeLink: {
    textDecoration: "none",
    color: "#007BFF",
    fontWeight: "700",
    borderBottom: "3px solid #007BFF",
    paddingBottom: "3px",
  },
};
