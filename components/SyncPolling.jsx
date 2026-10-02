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

                const data =
                    await response.json();

                if (
                    !data.success ||
                    !data.version
                ) {
                    return;
                }

                if (!isMounted) {
                    return;
                }

                /*
                 * اولین دریافت:
                 * فقط نسخه فعلی سرور ذخیره می‌شود.
                 * هیچ رویدادی اجرا نمی‌شود.
                 */
                if (
                    lastVersion.current === null
                ) {
                    lastVersion.current =
                        data.version;

                    return;
                }

                /*
                 * اگر داده‌ای روی سرور تغییر کرده باشد:
                 *
                 * به جای reload کردن کل صفحه،
                 * یک Event سراسری ارسال می‌کنیم.
                 *
                 * کامپوننت‌هایی که نیاز به بروزرسانی
                 * دارند خودشان به این Event گوش می‌دهند.
                 */
                if (
                    data.version !==
                    lastVersion.current
                ) {
                    lastVersion.current =
                        data.version;

                    window.dispatchEvent(
                        new Event(
                            "tms-sync-updated"
                        )
                    );
                }
            } catch (error) {
                console.error(
                    "Sync polling error:",
                    error
                );
            }
        }

        /*
         * بررسی اولیه
         */
        checkSync();

        /*
         * بررسی تغییرات هر ۵ ثانیه
         */
        const interval =
            setInterval(
                checkSync,
                POLLING_INTERVAL
            );

        return () => {
            isMounted = false;

            clearInterval(
                interval
            );
        };
    }, []);

    return null;
}