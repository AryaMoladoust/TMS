"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import SyncPolling from "@/components/SyncPolling";
import AuthGuard from "@/components/AuthGuard";
import PageTransition from "@/components/layout/PageTransition";

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

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
                setSidebarOpen={setSidebarOpen}
                mobileOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />

            <div className="main-wrapper">
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                <SyncPolling />

                <AuthGuard />

                <PageTransition>{children}</PageTransition>
            </div>
        </div>
    );
}