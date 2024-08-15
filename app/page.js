"use client";
import { useSidebar } from "@/context/SidebarContext";
import Image from "next/image";

export default function Home() {
  const { marginForSidebar } = useSidebar();

  return (
    <main
      className="overflow-hidden"
      style={{ marginLeft: marginForSidebar }}
    ></main>
  );
}
