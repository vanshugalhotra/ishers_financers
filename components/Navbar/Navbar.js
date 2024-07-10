// components/Navbar/Navbar.js
import React from "react";
import { FiMenu } from "react-icons/fi";
import { useSidebar } from "@/context/SidebarContext";

const Navbar = () => {
  const { toggleSideBar, marginForSidebar } = useSidebar();

  return (
    <nav
      className="border-b-2 border-gray-200 border-opacity-60 flex py-4 justify-around"
      style={{ marginLeft: marginForSidebar }}
    >
      {/* menu icon */}
      <div
        className="menu-icon p-1 md:hidden inline-block relative self-center"
        onClick={toggleSideBar}
      >
        <FiMenu className="h-8 w-8" />
      </div>
      <div className="heading uppercase text-4xl lg:text-5xl font-medium self-center">
        Isher&apos;s Financers
      </div>
    </nav>
  );
};

export default Navbar;
