import React from "react";
import { SidebarProvider } from "@/context/SidebarContext";
import { LoadingProvider } from "@/context/LoadingContext";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Layout from "@/components/Layout/Layout";
import { Inter } from "next/font/google";
import ErrorBoundary from "@/components/Error/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Isher's Financers",
  description: "Finance ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ background: "#effaff" }}>
        <NextTopLoader
          color="#FF9F43"
          initialPosition={0.08}
          crawlSpeed={200}
          height={2}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={100}
          shadow="0 0 10px #FF9F43,0 0 5px #FF9F43"
        />
        <LoadingProvider>
          <SidebarProvider>
            <Layout>
              <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
              <ErrorBoundary>
              {children}
              </ErrorBoundary>
              <section className="my-[20vh]"></section>
            </Layout>
          </SidebarProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
