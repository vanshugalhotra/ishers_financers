// components/Layout.js
"use client";

import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
