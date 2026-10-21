"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginScene, LoginTruck } from "@/components/auth/LoginScene";

function IconUser(props) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
            <path
                d="M4.5 20c1.4-4 4-6 7.5-6s6.1 2 7.5 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function IconLock(props) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
            <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="15" r="1.6" fill="currentColor" />
        </svg>
    );
}

function IconEye(props) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    );
}

function IconEyeOff(props) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M3.5 3.5l17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path
                d="M9.9 5.6A10.6 10.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a15 15 0 0 1-3.2 4M6.4 7.3C4 8.9 2.5 12 2.5 12s3.5 6.5 9.5 6.5c1.2 0 2.3-.2 3.3-.6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M9.9 10a3 3 0 0 0 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function IconShield(props) {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M12 3.5 19 6.3v5c0 5-3 8.4-7 9.2-4-.8-7-4.2-7-9.2v-5L12 3.5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
            />
            <path d="M9.3 12.2 11.2 14l3.6-3.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function IconPin(props) {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    );
}

function IconArrow(props) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(event) {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "ورود ناموفق بود.");
            }

            router.replace("/dashboard");
            router.refresh();
        } catch (error) {
            setError(error.message || "خطا در ورود به سیستم.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="login-hero">
            <LoginScene />
            <div className="login-road" aria-hidden="true" />
            <LoginTruck />

            <div className="login-hero-content">
                <div className="login-logo">
                    <img
                        src="/icons/icon-192.png"
                        alt="لوگوی موسسه حمل و نقل کامران"
                        width="84"
                        height="84"
                    />
                </div>

                <h1 className="login-hero-title">باربری</h1>
                <p className="login-hero-company">موسسه حمل و نقل کامران</p>

                <div className="login-glass-card">
                    <h2>ورود به سامانه</h2>

                    <div className="login-badge-row">
                        <span className="login-badge-line" />
                        <span className="login-badge">
                            <IconShield />
                            فقط برای کاربران شرکت
                        </span>
                        <span className="login-badge-line" />
                    </div>

                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="login-input-wrapper">
                            <label htmlFor="username" className="sr-only">
                                نام کاربری
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                placeholder="نام کاربری"
                                autoComplete="username"
                                disabled={loading}
                            />
                            <span className="login-input-icon">
                                <IconUser />
                            </span>
                        </div>

                        <div className="login-input-wrapper">
                            <label htmlFor="password" className="sr-only">
                                رمز عبور
                            </label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="رمز عبور"
                                autoComplete="current-password"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="login-password-toggle"
                                onClick={() => setShowPassword((value) => !value)}
                                disabled={loading}
                                aria-label={showPassword ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
                            >
                                {showPassword ? <IconEyeOff /> : <IconEye />}
                            </button>
                            <span className="login-input-icon">
                                <IconLock />
                            </span>
                        </div>

                        {error && <div className="login-error">{error}</div>}

                        <button type="submit" className="login-submit-button" disabled={loading}>
                            {loading ? (
                                "در حال ورود..."
                            ) : (
                                <>
                                    ورود
                                    <IconArrow />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="login-authorized-note">فقط کاربران مجاز</p>
                </div>

                <div className="login-hero-footer">
                    <p className="login-hero-location">
                        <IconPin />
                        شهرک صنعتی رشت
                    </p>
                    <p className="login-hero-tagline">همراه در مسیر توسعه کسب‌وکار شما</p>
                </div>
            </div>
        </main>
    );
}