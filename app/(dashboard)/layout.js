"use client";

import {
  useEffect,
  useState,
} from "react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  useEffect(() => {
    function handleOpenMobileMenu() {
      setMobileOpen(true);
    }

    window.addEventListener(
      "open-mobile-menu",
      handleOpenMobileMenu
    );

    return () => {
      window.removeEventListener(
        "open-mobile-menu",
        handleOpenMobileMenu
      );
    };
  }, []);

  return (
    <div
      className={`app-shell ${
        sidebarOpen
          ? "sidebar-is-open"
          : "sidebar-is-closed"
      }`}
    >
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={
          setSidebarOpen
        }
        mobileOpen={mobileOpen}
        onClose={() =>
          setMobileOpen(false)
        }
      />

      <div className="main-wrapper">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={
            setSidebarOpen
          }
        />

        {children}
      </div>
    </div>
  );
}