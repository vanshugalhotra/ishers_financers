// components/Sidebar/Sidebar.js
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { IoIosArrowBack, IoIosArrowDown, IoIosLogOut, IoIosAnalytics ,IoIosAdd, IoIosPerson, IoIosPersonAdd, IoMdPerson, IoMdDesktop } from "react-icons/io";
import { useSidebar } from "@/context/SidebarContext";

const SidebarItem = ({ name, MenuIcon, url }) => {
  const { linkClick } = useSidebar();

  const pathname = usePathname();
  const isActiveLink = (url) => {
    return url === pathname;
  };

  return (
    <li>
      <Link
        href={url}
        className={`sidebar-nav-link ${
          isActiveLink(url) ? "sidebar-nav-link-active" : ""
        }`}
        onClick={linkClick}
        id="dashboard"
      >
        <MenuIcon className="h-6 w-6 min-w-max" />
        <p className="sidebar-nav-link-p">{name}</p>
      </Link>
    </li>
  );
};

const SubMenu = ({ name, MenuIcon, url }) => {
  const { linkClick } = useSidebar();
  const pathname = usePathname();
  const isActiveLink = (url) => {
    return url === pathname;
  };

  return (
    <li>
      <Link
        href={url}
        className={`sidebar-nav-link ${
          isActiveLink(url) ? "sidebar-nav-link-active" : ""
        }`}
        onClick={linkClick}
      >
        <MenuIcon className="h-6 w-6 min-w-max" />
        <p className="sidebar-nav-link-p">{name}</p>
      </Link>
    </li>
  );
};

const Sidebar = ({ handleLogout }) => {
  const {
    isSidebarOpen,
    toggleSideBar,
    sideBarData,
    windowWidth,
    showClientSubMenu,
    toggleClientSubMenu,
  } = useSidebar();

  const { sideBarOpenWidth, sideBarCloseWidth, sideBarImage } = sideBarData;

  const Sidebar_animation = {
    open: {
      width: windowWidth >= 768 ? sideBarOpenWidth : "100vw",
      transition: {
        damping: 40,
      },
    },
    closed: {
      width: windowWidth >= 768 ? sideBarCloseWidth : "0vw",
      transition: {
        damping: 40,
      },
    },
  };

  const clientsSubMenu = [
    {
      name: "Add Client",
      icon: IoIosPersonAdd,
      url: "/addclient",
    },
    {
      name: "Show Clients",
      icon: IoIosPerson,
      url: "/clients",
    },
  ];

  return (
    <>
      <div
        className={`sidebar 
  } inline-block overflow-y-auto fixed flex-1 left-0 top-0 max-h-screen shadow-lg z-[10000] overflow-x-hidden scrollbar-thin`}
      >
        <motion.div
          variants={Sidebar_animation}
          animate={isSidebarOpen ? "open" : "closed"}
          className="bg-white text-gray shadow-xl z-[10000] w-full min-h-screen"
        >
          {/* Menus */}
          <div className="flex flex-col h-full">
            {/* user details */}
            <div className="user-details inline-flex justify-center flex-col items-center mt-4 border-b-2 border-gray-200 border-opacity-60">
              <div className="user-icon relative w-full h-40">
                <Image
                  alt="User"
                  className=""
                  fill
                  style={{ objectFit: "cover" }}
                  src={sideBarImage}
                />
              </div>
            </div>

            <div className="list-content py-2">
              <ul className="sidebar-nav-list">
                {/* dashboard */}
                <SidebarItem
                  name="Dashboard"
                  MenuIcon={IoMdDesktop}
                  url="/"
                />

                {/* client */}
                <li>
                  <div
                    className={`sidebar-nav-link`}
                    onClick={(event) => {
                      event.preventDefault();
                      toggleClientSubMenu();
                    }}
                    id="clients"
                  >
                    <IoMdPerson className="h-6 w-6 min-w-max" />
                    <p className="sidebar-nav-link-p">Clients</p>
                    <IoIosArrowDown
                      className={` ${
                        showClientSubMenu && "rotate-180"
                      } duration-200 ml-auto`}
                    />
                  </div>
                </li>
                <motion.ul
                  animate={
                    showClientSubMenu
                      ? {
                          height: "fit-content",
                        }
                      : {
                          height: 0,
                        }
                  }
                  className={`flex h-0 flex-col pl-14 text-[0.8rem] font-normal overflow-hidden ${
                    isSidebarOpen ? "" : "!hidden"
                  }`}
                >
                  {clientsSubMenu.map(({ name, icon, url }) => (
                    <SubMenu key={name} name={name} MenuIcon={icon} url={url} />
                  ))}
                </motion.ul>

                {/* records */}
                <SidebarItem
                  name="Records"
                  MenuIcon={IoIosAnalytics}
                  url="/loans"
                />
                {/* Add Loan */}
                <SidebarItem
                  name="Add Loan"
                  MenuIcon={IoIosAdd}
                  url="/addloan"
                />

                <li>
                  <Link
                    className={`sidebar-nav-link`}
                    href={"/"}
                    onClick={() => {
                      handleLogout();
                    }}
                    id="logout"
                  >
                    <IoIosLogOut className="h-6 w-6 min-w-max" />
                    <p className="sidebar-nav-link-p">Logout</p>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* back button */}
          <motion.div
            onClick={toggleSideBar}
            animate={
              isSidebarOpen
                ? {
                    x: 0,
                    y: 0,
                    rotate: 0,
                  }
                : {
                    x: 5,
                    rotate: 180,
                  }
            }
            transition={{ duration: 0 }}
            className="absolute w-fit h-fit z-50 right-2 bottom-3 cursor-pointer"
          >
            <IoIosArrowBack className="h-6 w-6 mr-2" />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Sidebar;
