"use client";
import { useSidebar } from "@/context/SidebarContext";
import Image from "next/image";

export default function Home() {
  const { marginForSidebar } = useSidebar();

  return (
    <main className="overflow-hidden" style={{ marginLeft: marginForSidebar }}>
      <Image
        alt="Finance"
        className="w-[95vw] h-[94vh]"
        layout="fixed"
        width={1000}
        height={1000}
        objectFit="cover"
        src={`/assets/images/background/bg.png`}
      />
    </main>
  );
}
