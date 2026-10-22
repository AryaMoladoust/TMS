/*
 * Full-screen "entering the system" loader shown after the truck has left.
 * Pure markup; the motion is CSS (see "LOGIN – exit + loader" in globals.css).
 */
export default function LoginLoader() {
    return (
        <div className="login-loader" role="status" aria-live="polite">
            <div className="login-loader-card">
                <div className="login-loader-badge" aria-hidden="true">
                    <svg
                        className="login-loader-track"
                        viewBox="0 0 124 124"
                        fill="none"
                    >
                        <circle
                            cx="62"
                            cy="62"
                            r="56"
                            stroke="#dfe6f1"
                            strokeWidth="4"
                            strokeDasharray="9 9"
                            strokeLinecap="round"
                        />
                    </svg>

                    <svg
                        className="login-loader-ring"
                        viewBox="0 0 124 124"
                        fill="none"
                    >
                        <defs>
                            <linearGradient
                                id="lgLoaderGrad"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="1"
                            >
                                <stop offset="0" stopColor="#2ee6a6" />
                                <stop offset="1" stopColor="#1f6fe0" />
                            </linearGradient>
                        </defs>

                        <circle
                            cx="62"
                            cy="62"
                            r="56"
                            stroke="url(#lgLoaderGrad)"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray="112 240"
                        />
                    </svg>

                    <div className="login-loader-logo">
                        <img
                            src="/icons/icon-192.png"
                            alt=""
                            width="76"
                            height="76"
                        />
                    </div>
                </div>

                <h2>در حال ورود به سامانه</h2>

                <p>داشبورد در حال آماده‌سازی است...</p>

                <div className="login-loader-boxes" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                </div>
            </div>
        </div>
    );
}
