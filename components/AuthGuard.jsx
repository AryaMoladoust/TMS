"use client";

import { useEffect, useRef } from "react";

const CHECK_INTERVAL = 5000;

export default function AuthGuard() {
    const checkingRef = useRef(false);

    useEffect(() => {
        let mounted = true;

        async function checkAuth() {
            if (checkingRef.current) {
                return;
            }

            checkingRef.current = true;

            try {
                const response = await fetch(
                    "/api/auth/me",
                    {
                        method: "GET",
                        cache: "no-store",
                        credentials: "include",
                    }
                );

                if (!mounted) {
                    return;
                }

                /*
                 * Session وجود ندارد یا منقضی شده
                 */
                if (response.status === 401) {
                    window.location.replace(
                        "/auth/login"
                    );

                    return;
                }

                /*
                 * خطاهای سرور:
                 * فعلاً کاربر را بیرون نمی‌اندازیم.
                 */
                if (!response.ok) {
                    return;
                }

                const data =
                    await response.json();

                /*
                 * پاسخ معتبر باید شامل
                 * success و user باشد.
                 */
                if (
                    !data?.success ||
                    !data?.user
                ) {
                    window.location.replace(
                        "/auth/login"
                    );
                }
            } catch (error) {
                console.error(
                    "Auth guard error:",
                    error
                );
            } finally {
                checkingRef.current = false;
            }
        }

        /*
         * بررسی اولیه هنگام ورود به Dashboard
         */
        checkAuth();

        /*
         * بررسی دوره‌ای Session
         */
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