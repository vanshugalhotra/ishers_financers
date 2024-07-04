"use client";

import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import useWindowWidth from "@/hooks/useWindowWidth";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sideBarData = {
    sideBarOpenWidth: "20vw",
    sideBarCloseWidth: "4vw",
    sideBarImage: "/assets/Images/background/grad1.jpg",
  };
  const windowWidth = useWindowWidth();

  // Toggle function to switch isOpen state
  const toggleSideBar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Navbar
        toggleSideBar={toggleSideBar}
        sideBarData={sideBarData}
        isSidebarOpen={isSidebarOpen}
        windowWidth={windowWidth}
      />
      <Sidebar
        toggleSideBar={toggleSideBar}
        isOpen={isSidebarOpen}
        sideBarData={sideBarData}
        windowWidth={windowWidth}
      />
    </div>
  );
};

export default Layout;
