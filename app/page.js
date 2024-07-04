import Layout from "@/components/Layout/Layout";
import dynamic from "next/dynamic";

// components
const Sidebar = dynamic(() => import("@/components/Sidebar/Sidebar"), {
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  return (
    <main className="w-full">
      <Layout />
    </main>
  );
}
