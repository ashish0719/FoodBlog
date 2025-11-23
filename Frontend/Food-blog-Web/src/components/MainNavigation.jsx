import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import FloatingChatIcon from "./FloatingChatIcon";
import { Outlet } from "react-router-dom";

export default function MainNavigation() {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
      <FloatingChatIcon />
    </div>
  );
}
