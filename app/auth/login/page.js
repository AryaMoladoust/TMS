"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
            <path
                d="M8 10.5V8a4 4 0 0 1 8 0v2.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
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

function IconBox(props) {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M3.5 8.5 12 4l8.5 4.5L12 13 3.5 8.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path
                d="M3.5 8.5V16l8.5 4.5V13M20.5 8.5V16L12 20.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function IconUsers(props) {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...props}>
            <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M3 19c.9-3.4 3-5 6-5s5.1 1.6 6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path
                d="M15.5 6.2c1.5.3 2.6 1.5 2.6 3s-1.1 2.7-2.6 3M18.5 19c-.5-2-1.5-3.4-3-4.2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    );
}

function IconChart(props) {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M4 20V10M11 20V4M18 20v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M3 20h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function TruckRouteIllustration() {
    return (
        <svg
            className="login-route-svg"
            viewBox="0 0 360 480"
            preserveAspectRatio="xMidYMax slice"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <pattern id="loginDots" width="22" height="22" patternUnits="userSpaceOnUse">
                    <circle cx="1.4" cy="1.4" r="1.4" fill="#ffffff" />
                </pattern>
                <radialGradient id="loginGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </radialGradient>
            </defs>

            <rect x="0" y="0" width="360" height="480" fill="url(#loginDots)" opacity="0.05" />

            {/* road */}
            <path d="M40 480 L150 120 L210 120 L320 480 Z" fill="#ffffff" opacity="0.035" />
            <path
                className="login-route-line"
                d="M180 480 L180 120"
                stroke="#ffffff"
                strokeOpacity="0.28"
                strokeWidth="3"
                strokeDasharray="10 12"
                strokeLinecap="round"
            />

            {/* delivery route */}
            <path
                d="M60 300 C 120 250, 90 170, 160 130 S 300 90, 300 40"
                fill="none"
                stroke="#8fc1ff"
                strokeOpacity="0.55"
                strokeWidth="2"
                strokeDasharray="1 9"
                strokeLinecap="round"
            />
            <circle cx="120" cy="230" r="4" fill="#8fc1ff" />
            <circle cx="185" cy="145" r="4" fill="#8fc1ff" />
            <circle cx="300" cy="40" r="10" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.5" />
            <g className="login-pin-pulse">
                <circle cx="300" cy="40" r="6" fill="#ffffff" />
            </g>

            {/* headlight glow */}
            <circle cx="260" cy="330" r="70" fill="url(#loginGlow)" />

            {/* truck */}
            <g>
                <rect x="40" y="292" width="150" height="66" rx="8" fill="#f4f7fb" />
                <rect x="52" y="304" width="60" height="18" rx="3" fill="#0b1526" opacity="0.12" />
                <path
                    d="M190 358 V304 a10 10 0 0 1 10-10 h34 a14 14 0 0 1 12 7 l24 34 a10 10 0 0 1 1.6 5.4 V358 Z"
                    fill="#f4f7fb"
                />
                <rect x="208" y="308" width="30" height="24" rx="4" fill="#0b1526" opacity="0.75" />
                <circle cx="258" cy="333" r="6" fill="var(--primary)" />
                <circle cx="88" cy="360" r="20" fill="#0b1526" />
                <circle cx="88" cy="360" r="8" fill="#3a4a63" />
                <circle cx="222" cy="360" r="20" fill="#0b1526" />
                <circle cx="222" cy="360" r="8" fill="#3a4a63" />
            </g>
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
        <main className="login-page">
            <div className="login-shell">
                <section className="login-visual" aria-hidden="true">
                    <TruckRouteIllustration />
                    <div className="login-visual-scrim" />

                    <div className="login-visual-brand">
                        <span className="login-visual-brand-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M2.5 16V7.5A1.5 1.5 0 0 1 4 6h9.5A1.5 1.5 0 0 1 15 7.5V16"
                                    stroke="#fff"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M15 10h3.4a1.5 1.5 0 0 1 1.28.72l2.1 3.5A1.5 1.5 0 0 1 22 15v1a1.5 1.5 0 0 1-1.5 1.5H15"
                                    stroke="#fff"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <circle cx="7" cy="18.2" r="1.9" stroke="#fff" strokeWidth="1.7" />
                                <circle cx="17.5" cy="18.2" r="1.9" stroke="#fff" strokeWidth="1.7" />
                            </svg>
                        </span>
                        <span>موسسه حمل و نقل کامران</span>
                    </div>

                    <div className="login-visual-content">
                        <h2>از ثبت بار تا تحویل، در یک سامانه</h2>
                        <ul className="login-visual-features">
                            <li>
                                <span className="icon-dot">
                                    <IconBox />
                                </span>
                                ثبت و پیگیری بار
                            </li>
                            <li>
                                <span className="icon-dot">
                                    <IconUsers />
                                </span>
                                مدیریت راننده‌ها و ناوگان
                            </li>
                            <li>
                                <span className="icon-dot">
                                    <IconChart />
                                </span>
                                گزارش‌ها و صورت‌حساب
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="login-form-panel">
                    <div className="login-card-header">
                        <h1>ورود به سیستم</h1>
                        <p>برای ادامه، وارد حساب کاربری خود شوید</p>
                    </div>

                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="login-field">
                            <label htmlFor="username">نام کاربری</label>
                            <div className="login-input-wrapper">
                                <span className="login-input-icon">
                                    <IconUser />
                                </span>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    placeholder="نام کاربری"
                                    autoComplete="username"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="login-field">
                            <label htmlFor="password">رمز عبور</label>
                            <div className="login-input-wrapper">
                                <span className="login-input-icon">
                                    <IconLock />
                                </span>
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
                            </div>
                        </div>

                        {error && <div className="login-error">{error}</div>}

                        <button type="submit" className="login-submit-button" disabled={loading}>
                            {loading && <span className="login-spinner" aria-hidden="true" />}
                            {loading ? "در حال ورود..." : "ورود"}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}