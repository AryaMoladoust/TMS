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

function LogoMark() {
    return (
        <svg viewBox="0 0 64 64" width="100%" height="100%">
            <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#2f6fef" />
                    <stop offset="1" stopColor="#0b1f3d" />
                </linearGradient>
            </defs>
            <rect width="64" height="64" rx="18" fill="url(#logoGrad)" />
            <path d="M14 48 L30 16 L38 16 L22 48 Z" fill="#ffffff" />
            <path d="M30 48 L46 16 L54 16 L38 48 Z" fill="#ffffff" opacity="0.5" />
            <rect x="15" y="41.5" width="15" height="4" rx="2" fill="#0b1f3d" transform="rotate(-27 15 41.5)" />
        </svg>
    );
}

function HeroIllustration() {
    const doors = Array.from({ length: 6 });
    return (
        <svg
            className="login-hero-svg"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#bfe0f5" />
                    <stop offset="0.6" stopColor="#dcecf8" />
                    <stop offset="1" stopColor="#eef5fa" />
                </linearGradient>
                <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
            </defs>

            <rect width="1440" height="900" fill="url(#skyGrad)" />
            <circle cx="1080" cy="150" r="220" fill="url(#sunGlow)" />
            <ellipse cx="260" cy="130" rx="90" ry="24" fill="#ffffff" opacity="0.55" />
            <ellipse cx="420" cy="170" rx="60" ry="16" fill="#ffffff" opacity="0.45" />

            {/* mountains */}
            <path
                d="M0,430 L140,340 L280,410 L420,320 L560,420 L720,330 L880,410 L1020,350 L1180,420 L1320,360 L1440,420 L1440,540 L0,540 Z"
                fill="#b7c9dd"
                opacity="0.7"
            />
            <path
                d="M0,470 L160,410 L320,460 L480,390 L640,460 L800,400 L960,470 L1120,410 L1280,470 L1440,440 L1440,560 L0,560 Z"
                fill="#93a8c4"
                opacity="0.85"
            />

            {/* warehouse */}
            <rect x="60" y="560" width="1320" height="190" fill="#e3e8ee" />
            <rect x="60" y="560" width="1320" height="12" fill="#c3cdd9" />
            <rect x="60" y="598" width="1320" height="10" fill="var(--primary, #2563eb)" opacity="0.85" />
            {doors.map((_, i) => (
                <rect key={i} x={130 + i * 200} y="648" width="120" height="95" rx="6" fill="#c7d0da" />
            ))}

            {/* gate */}
            <rect x="640" y="470" width="24" height="280" fill="#4b5b70" />
            <rect x="800" y="470" width="24" height="280" fill="#4b5b70" />
            <rect x="622" y="458" width="220" height="16" rx="4" fill="#3a4a5e" />
            <rect x="650" y="480" width="170" height="44" rx="8" fill="#0f1f3d" opacity="0.92" />
            <text x="735" y="508" textAnchor="middle" fontSize="15" fontWeight="700" fill="#ffffff" style={{ fontFamily: "inherit" }}>
                شهرک صنعتی رشت
            </text>

            {/* flag */}
            <line x1="880" y1="468" x2="880" y2="560" stroke="#4b5b70" strokeWidth="4" />
            <rect x="882" y="468" width="46" height="10" fill="#1f8a4c" />
            <rect x="882" y="478" width="46" height="10" fill="#f4f7fb" />
            <rect x="882" y="488" width="46" height="10" fill="#c0392b" />

            {/* ground */}
            <rect x="0" y="700" width="1440" height="200" fill="#c9d0d8" />
            <path
                d="M0,780 C 260,720 480,830 860,760 C 1140,710 1280,790 1440,740 L1440,900 L0,900 Z"
                fill="#0c1526"
            />

            {/* truck */}
            <g>
                <rect x="120" y="628" width="330" height="132" rx="14" fill="#f5f7fb" />
                <rect x="120" y="682" width="330" height="15" fill="var(--primary, #2563eb)" opacity="0.85" />
                <path
                    d="M450 760 V676 a12 12 0 0 1 12-12 h44 a17 17 0 0 1 14 8 l30 42 a12 12 0 0 1 2 6.6 V760 Z"
                    fill="#f5f7fb"
                />
                <rect x="474" y="684" width="38" height="30" rx="5" fill="#0f1f3d" opacity="0.78" />
                <circle cx="524" cy="712" r="7" fill="var(--primary, #2563eb)" />
                <circle cx="196" cy="768" r="26" fill="#0f1f3d" />
                <circle cx="196" cy="768" r="10" fill="#3a4a63" />
                <circle cx="392" cy="768" r="26" fill="#0f1f3d" />
                <circle cx="392" cy="768" r="10" fill="#3a4a63" />
                <circle cx="484" cy="768" r="22" fill="#0f1f3d" />
                <circle cx="484" cy="768" r="8" fill="#3a4a63" />
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
        <main className="login-hero">
            <HeroIllustration />

            <div className="login-hero-content">
                <div className="login-logo">
                    <LogoMark />
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