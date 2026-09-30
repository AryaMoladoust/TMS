"use client";

import { useEffect, useRef } from "react";

const POLLING_INTERVAL = 5000;

export default function SyncPolling() {
    const lastVersion = useRef(null);

    useEffect(() => {
        let isMounted = true;

        async function checkSync() {
            try {
                const response = await fetch(
                    "/api/sync",
                    {
                        cache: "no-store",
                    }
                );

                if (!response.ok) {
                    return;
                }

                const data = await response.json();

                if (!data.success || !data.version) {
                    return;
                }

                if (!isMounted) {
                    return;
                }

                // اولین دریافت فقط نسخه فعلی را ذخیره می‌کند
                if (lastVersion.current === null) {
                    lastVersion.current = data.version;
                    return;
                }

                // اگر تغییری روی سرور اتفاق افتاده باشد
                if (
                    data.version !==
                    lastVersion.current
                ) {
                    lastVersion.current =
                        data.version;

                    window.location.reload();
                }
            } catch (error) {
                console.error(
                    "Sync polling error:",
                    error
                );
            }
        }

        checkSync();

        const interval = setInterval(
            checkSync,
            POLLING_INTERVAL
        );

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    return null;
}