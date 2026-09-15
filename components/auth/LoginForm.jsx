"use client";

import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!username.trim() || !password) {
      setError("نام کاربری و رمز عبور را وارد کنید.");
      return;
    }

    try {
      setLoading(true);

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

      if (!response.ok || !data.success) {
        setError(
          data.message || "نام کاربری یا رمز عبور اشتباه است."
        );
        return;
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        "ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-field">
        <label htmlFor="username">نام کاربری</label>

        <div className="login-input-wrapper">
          <UserRound size={19} className="login-input-icon" />

          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="نام کاربری را وارد کنید"
            autoComplete="username"
            disabled={loading}
          />
        </div>
      </div>

      <div className="login-field">
        <label htmlFor="password">رمز عبور</label>

        <div className="login-input-wrapper">
          <LockKeyhole size={19} className="login-input-icon" />

          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="رمز عبور را وارد کنید"
            autoComplete="current-password"
            disabled={loading}
          />

          <button
            type="button"
            className="login-password-toggle"
            onClick={() =>
              setShowPassword((current) => !current)
            }
            disabled={loading}
            aria-label={
              showPassword
                ? "مخفی کردن رمز عبور"
                : "نمایش رمز عبور"
            }
          >
            {showPassword ? (
              <EyeOff size={19} />
            ) : (
              <Eye size={19} />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="login-error">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="login-submit-button"
        disabled={loading}
      >
        {loading ? "در حال ورود..." : "ورود به سیستم"}
      </button>
    </form>
  );
}