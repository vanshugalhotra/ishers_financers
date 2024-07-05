"use client";

import React from "react";
import { useSidebar } from "@/context/SidebarContext";

const AddClient = () => {
  const { marginForSidebar } = useSidebar();

  return (
    <section style={{ marginLeft: marginForSidebar }} className="py-8 px-8">
      <div className="top flex items-center justify-between">
        <div className="left">
          <h2 className="text-xl text-gray-900 font-medium tracking-wide leading-snug">
            Add Client
          </h2>
          <p className="text-xs text-gray-600 py-1 tracking-wide">
            Add New Client
          </p>
        </div>
      </div>
    </section>
  );
};

export default AddClient;
