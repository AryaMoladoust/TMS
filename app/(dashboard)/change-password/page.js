"use client";

import {
    KeyRound,
    Lock,
    ShieldCheck,
} from "lucide-react";

import { useState } from "react";

export default function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!currentPassword) {
            setError(
                "رمز عبور فعلی را وارد کنید."
            );
            return;
        }

        if (!newPassword) {
            setError(
                "رمز عبور جدید را وارد کنید."
            );
            return;
        }

        if (newPassword.length < 4) {
            setError(
                "رمز عبور جدید باید حداقل ۴ کاراکتر باشد."
            );
            return;
        }

        if (
            newPassword !==
            confirmPassword
        ) {
            setError(
                "تکرار رمز عبور با رمز جدید یکسان نیست."
            );
            return;
        }

        if (
            currentPassword ===
            newPassword
        ) {
            setError(
                "رمز جدید باید با رمز فعلی متفاوت باشد."
            );
            return;
        }

        try {
            setSaving(true);

            const response = await fetch(
                "/api/auth/change-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword,
                        confirmPassword,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "تغییر رمز عبور انجام نشد."
                );
            }

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setSuccess(
                "رمز عبور با موفقیت تغییر کرد."
            );
        } catch (error) {
            console.error(error);

            setError(
                error.message ||
                "خطا در تغییر رمز عبور."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className="main-content">

            <div className="page-heading">

                <h1>
                    تغییر رمز عبور
                </h1>

                <p>
                    رمز عبور حساب کاربری خود را تغییر دهید
                </p>

            </div>


            <section className="change-password-panel">

                <div className="change-password-header">

                    <div className="change-password-icon">
                        <KeyRound
                            size={24}
                        />
                    </div>

                    <div>
                        <h2>
                            امنیت حساب
                        </h2>

                        <p>
                            رمز عبور جدید فقط برای حساب خودتان اعمال می‌شود.
                        </p>
                    </div>

                </div>


                {error && (
                    <div className="change-password-message error">
                        {error}
                    </div>
                )}


                {success && (
                    <div className="change-password-message success">
                        {success}
                    </div>
                )}


                <form
                    className="change-password-form"
                    onSubmit={handleSubmit}
                >

                    <div className="change-password-field">

                        <label>
                            رمز عبور فعلی
                        </label>

                        <div className="change-password-input">

                            <Lock
                                size={18}
                            />

                            <input
                                type="password"
                                value={
                                    currentPassword
                                }
                                onChange={(event) =>
                                    setCurrentPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="رمز فعلی"
                                autoComplete="current-password"
                            />

                        </div>

                    </div>


                    <div className="change-password-field">

                        <label>
                            رمز عبور جدید
                        </label>

                        <div className="change-password-input">

                            <KeyRound
                                size={18}
                            />

                            <input
                                type="password"
                                value={
                                    newPassword
                                }
                                onChange={(event) =>
                                    setNewPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="رمز جدید"
                                autoComplete="new-password"
                            />

                        </div>

                    </div>


                    <div className="change-password-field">

                        <label>
                            تکرار رمز عبور جدید
                        </label>

                        <div className="change-password-input">

                            <ShieldCheck
                                size={18}
                            />

                            <input
                                type="password"
                                value={
                                    confirmPassword
                                }
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="تکرار رمز جدید"
                                autoComplete="new-password"
                            />

                        </div>

                    </div>


                    <button
                        type="submit"
                        className="change-password-button"
                        disabled={saving}
                    >

                        <KeyRound
                            size={18}
                        />

                        {saving
                            ? "در حال تغییر..."
                            : "تغییر رمز عبور"}

                    </button>

                </form>

            </section>

        </main>
    );
}