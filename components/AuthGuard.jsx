"use client";

import { useEffect, useRef } from "react";

const CHECK_INTERVAL = 5000;

export default function AuthGuard() {
    const checkingRef = useRef(false);

    useEffect(() => {
        let mounted = true;

        async function checkAuth() {
            if (checkingRef.current) return;

            checkingRef.current = true;

            try {
                const response = await fetch("/api/auth/me", {
                    method: "GET",
                    cache: "no-store",
                    credentials: "include",
                });

                if (!mounted) return;

                if (response.status === 401) {
                    window.location.replace("/auth/login");
                    return;
                }

                if (!response.ok) {
                    return;
                }

                const data = await response.json();

                if (!data?.success || !data?.user) {
                    window.location.replace("/auth/login");
                }
            } catch (error) {
                console.error("Auth guard error:", error);
            } finally {
                checkingRef.current = false;
            }
        }

        checkAuth();

        const interval = setInterval(
            checkAuth,
            CHECK_INTERVAL
        );

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    return null;
}