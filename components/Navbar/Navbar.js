import React from "react";
import { FiMenu } from "react-icons/fi";

const Navbar = ({ toggleSideBar, sideBarData, isSidebarOpen, windowWidth }) => {
  const { sideBarOpenWidth, sideBarCloseWidth, sideBarImage } = sideBarData;
  // local variables
  let marginForSidebar = isSidebarOpen ? sideBarOpenWidth : sideBarCloseWidth;
  marginForSidebar = windowWidth < 768 ? 0 : marginForSidebar;
  return (
    <nav
      className="border-b-2 border-gray-200 border-opacity-60 flex py-4 justify-around"
      style={{ marginLeft: marginForSidebar }}
    >
      {/* menu icon */}
      <div
        className="menu-icon p-1 md:hidden inline-block relative self-center"
        onClick={() => {
          toggleSideBar();
        }}
      >
        <FiMenu className="h-8 w-8" />
      </div>
      <div className="heading uppercase text-4xl lg:text-5xl font-medium self-center">
        Welcome To Finance Dashboard
      </div>
    </nav>
  );
};

export default Navbar;
