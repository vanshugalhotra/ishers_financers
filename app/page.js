"use client";
import { useSidebar } from "@/context/SidebarContext";
import TotalAmountCard from "@/components/Others/TotalAmountCard";

export default function Home() {
  const { marginForSidebar } = useSidebar();

  return (
    <main
      className="overflow-hidden p-6"
      style={{ marginLeft: marginForSidebar }}
    >
      <TotalAmountCard />
      {/* Other components or content */}
    </main>
  );
}
