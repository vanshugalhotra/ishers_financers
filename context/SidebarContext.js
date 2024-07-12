// context/SidebarContext.js
"use client";

import React, { createContext, useContext, useState } from "react";
import useWindowWidth from "@/hooks/useWindowWidth";
import { useRouter } from "next/navigation";

const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showClientSubMenu, setShowClientSubMenu] = useState(true);
  const sideBarData = {
    sideBarOpenWidth: "20vw",
    sideBarCloseWidth: "4vw",
    sideBarImage: "/assets/images/background/grad1.jpg",
  };
  const windowWidth = useWindowWidth();
  const router = useRouter();

  const toggleSideBar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleClientSubMenu = () => {
    setShowClientSubMenu(!showClientSubMenu);
  };

  const linkClick = () => {
    if (windowWidth < "768") {
      toggleSideBar();
    }
  };

  const marginForSidebar = isSidebarOpen
    ? sideBarData.sideBarOpenWidth
    : sideBarData.sideBarCloseWidth;
  const effectiveMarginForSidebar = windowWidth < 768 ? 0 : marginForSidebar;

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        showClientSubMenu,
        sideBarData,
        windowWidth,
        toggleSideBar,
        toggleClientSubMenu,
        linkClick,
        marginForSidebar: effectiveMarginForSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
