"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}) {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  useEffect(() => {
    function handleOpen() {
      setMobileOpen(true);
    }

    window.addEventListener(
      "open-mobile-menu",
      handleOpen
    );

    return () => {
      window.removeEventListener(
        "open-mobile-menu",
        handleOpen
      );
    };
  }, []);

  return (
    <div className="app-shell">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() =>
          setMobileOpen(false)
        }
      />

      <div className="main-wrapper">
        <Header />

        {children}
      </div>
    </div>
  );
}