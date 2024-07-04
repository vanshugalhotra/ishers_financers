"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useWindowWidth from "@/hooks/useWindowWidth";
import { motion } from "framer-motion";
import Image from "next/image";

import { AiOutlineUser, AiOutlineUserAdd } from "react-icons/ai";
import { IoIosArrowBack, IoIosArrowDown } from "react-icons/io";
import { LuLayoutDashboard } from "react-icons/lu";
import { CgUserList } from "react-icons/cg";
import { MdOutlineAttachMoney } from "react-icons/md";

const SidebarItem = ({ name, MenuIcon, url }) => {
  return (
    <li>
      <Link
        href={url}
        className={`sidebar-nav-link ${
          isActiveLink("/") ? "sidebar-nav-link-active" : ""
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
  const router = useRouter();

  const windowWidth = useWindowWidth();
  const isActiveLink = (pathname) => {
    return router.asPath === pathname;
  };

  const linkClick = () => {
    if (windowWidth < "768") {
    }
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

const Sidebar = ({ isOpen, toggleSideBar, sideBarData, windowWidth }) => {
  // states
  const [showClientSubMenu, setShowClientSubMenu] = useState(true);

  const { sideBarOpenWidth, sideBarCloseWidth, sideBarImage } = sideBarData;

  const isActiveLink = (pathname) => {
    // return router.asPath === pathname;
  };

  //   Animation
  const Sidebar_animation = {
    // system view
    open: {
      width: windowWidth >= "768" ? sideBarOpenWidth : "100vw",
      transition: {
        damping: 40,
      },
    },
    closed: {
      width: windowWidth >= "768" ? sideBarCloseWidth : "0vw",
      transition: {
        damping: 40,
      },
    },
  };

  const linkClick = () => {
    if (windowWidth < "768") {
    }
  };

  // Toggle function for showClientSubMenu state
  const toggleClientSubMenu = () => {
    setShowClientSubMenu(!showClientSubMenu);
  };

  const SidebarItems = [];
  const clientsSubMenu = [
    {
      name: "add client",
      icon: AiOutlineUserAdd,
      url: "/",
    },
    {
      name: "Show Clients",
      icon: CgUserList,
      url: "/",
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
          animate={isOpen ? "open" : "closed"}
          className="bg-white text-gray shadow-xl z-[10000] w-full min-h-screen"
        >
          {/* Menus */}
          <div className="flex flex-col h-full">
            {/* user details */}

            <div className="user-details inline-flex justify-center flex-col items-center mt-4 border-b-2 border-gray-200 border-opacity-60">
              <div className="user-icon relative w-56 h-40">
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
                <li>
                  <Link
                    href={"/"}
                    className={`sidebar-nav-link ${
                      isActiveLink("/") ? "sidebar-nav-link-active" : ""
                    }`}
                    onClick={linkClick}
                    id="dashboard"
                  >
                    <LuLayoutDashboard className="h-6 w-6 min-w-max" />
                    <p className="sidebar-nav-link-p">Dashboard</p>
                  </Link>
                </li>

                {/* Products */}
                <li>
                  <div
                    className={`sidebar-nav-link`}
                    onClick={(event) => {
                      linkClick(event);
                    }}
                    id="clients"
                  >
                    <AiOutlineUser className="h-6 w-6 min-w-max" />
                    <p className="sidebar-nav-link-p">Clients</p>
                    <IoIosArrowDown
                      className={` ${
                        showClientSubMenu && "rotate-180"
                      } duration-200 ml-auto`}
                      onClick={(event) => {
                        toggleClientSubMenu();
                        event.preventDefault();
                        event.stopPropagation();
                      }}
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
                    isOpen ? "" : "!hidden"
                  }`}
                >
                  {clientsSubMenu.map(({ name, icon, url }) => {
                    return (
                      <SubMenu
                        key={name}
                        name={name}
                        MenuIcon={icon}
                        url={url}
                      />
                    );
                  })}
                </motion.ul>

                {/* records */}
                <li>
                  <Link
                    href={"/"}
                    className={`sidebar-nav-link ${
                      isActiveLink("/") ? "sidebar-nav-link-active" : ""
                    }`}
                    onClick={linkClick}
                    id="records"
                  >
                    <MdOutlineAttachMoney className="h-6 w-6 min-w-max" />
                    <p className="sidebar-nav-link-p">Records</p>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* back button */}

          <motion.div
            onClick={() => {
              toggleSideBar();
            }}
            animate={
              isOpen
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
