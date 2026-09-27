"use client";

import {
    UserPlus,
    Users,
    Trash2,
    ShieldCheck,
    User,
    KeyRound,
} from "lucide-react";

import { useEffect, useState } from "react";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [username, setUsername] = useState("");
    const [saving, setSaving] = useState(false);

    const [currentUser, setCurrentUser] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            setError("");

            const [usersResponse, meResponse] =
                await Promise.all([
                    fetch("/api/users", {
                        cache: "no-store",
                    }),

                    fetch("/api/auth/me", {
                        cache: "no-store",
                    }),
                ]);

            const usersData =
                await usersResponse.json();

            const meData =
                await meResponse.json();

            if (!usersResponse.ok) {
                throw new Error(
                    usersData.message ||
                        "دریافت کاربران انجام نشد."
                );
            }

            setUsers(
                Array.isArray(usersData.users)
                    ? usersData.users
                    : []
            );

            setCurrentUser(
                meData?.user || null
            );
        } catch (error) {
            console.error(error);

            setError(
                error.message ||
                    "خطا در دریافت اطلاعات کاربران."
            );
        } finally {
            setLoading(false);
        }
    }

    async function addUser(event) {
        event.preventDefault();

        const cleanUsername =
            username.trim();

        if (!cleanUsername) {
            setError(
                "نام کاربری را وارد کنید."
            );
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const response = await fetch(
                "/api/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        username:
                            cleanUsername,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "ساخت کاربر انجام نشد."
                );
            }

            setUsername("");

            setSuccess(
                `کاربر «${cleanUsername}» با موفقیت ساخته شد. رمز اولیه: 1234`
            );

            await loadData();
        } catch (error) {
            console.error(error);

            setError(
                error.message ||
                    "خطا در ساخت کاربر."
            );
        } finally {
            setSaving(false);
        }
    }

    async function deleteUser(id, name) {
        if (
            !window.confirm(
                `آیا از حذف کاربر «${name}» مطمئن هستید؟`
            )
        ) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            const response = await fetch(
                `/api/users?id=${id}`,
                {
                    method: "DELETE",
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "حذف کاربر انجام نشد."
                );
            }

            setUsers((previous) =>
                previous.filter(
                    (user) =>
                        user._id !== id
                )
            );

            setSuccess(
                "کاربر با موفقیت حذف شد."
            );
        } catch (error) {
            console.error(error);

            setError(
                error.message ||
                    "خطا در حذف کاربر."
            );
        }
    }

    return (
        <main className="main-content">

            {/* HEADER */}

            <div className="page-heading">

                <h1>
                    مدیریت کاربران
                </h1>

                <p>
                    مدیریت حساب‌های کاربری سیستم
                </p>

            </div>


            {/* ADD USER */}

            <section
                className="users-form-panel"
            >

                <div
                    className="users-panel-header"
                >

                    <div
                        className="users-panel-icon"
                    >
                        <UserPlus
                            size={22}
                        />
                    </div>

                    <div>
                        <h2>
                            افزودن کاربر
                        </h2>

                        <p>
                            رمز اولیه کاربر جدید ۱۲۳۴ است.
                        </p>
                    </div>

                </div>


                <form
                    className="users-add-form"
                    onSubmit={addUser}
                >

                    <div
                        className="users-input-group"
                    >

                        <label>
                            نام کاربری
                        </label>

                        <div
                            className="users-input-wrapper"
                        >

                            <User
                                size={18}
                            />

                            <input
                                value={username}
                                onChange={(event) =>
                                    setUsername(
                                        event.target.value
                                    )
                                }
                                placeholder="مثلاً ali"
                            />

                        </div>

                    </div>


                    <button
                        type="submit"
                        className="users-add-button"
                        disabled={saving}
                    >

                        <UserPlus
                            size={18}
                        />

                        {saving
                            ? "در حال ساخت..."
                            : "افزودن کاربر"}

                    </button>

                </form>

            </section>


            {/* MESSAGES */}

            {error && (
                <div
                    className="users-message users-message-error"
                >
                    {error}
                </div>
            )}

            {success && (
                <div
                    className="users-message users-message-success"
                >
                    {success}
                </div>
            )}


            {/* USERS */}

            <section
                className="users-list-panel"
            >

                <div
                    className="users-list-header"
                >

                    <div>

                        <div
                            className="users-list-title"
                        >

                            <Users
                                size={21}
                            />

                            <h2>
                                کاربران سیستم
                            </h2>

                        </div>

                        <p>
                            تعداد کاربران:{" "}
                            {users.length}
                        </p>

                    </div>

                </div>


                {loading ? (
                    <div className="users-empty">
                        در حال دریافت کاربران...
                    </div>
                ) : users.length === 0 ? (
                    <div className="users-empty">
                        کاربری وجود ندارد.
                    </div>
                ) : (
                    <div className="users-table-wrapper">

                        <table className="users-table">

                            <thead>
                                <tr>
                                    <th>
                                        نام کاربری
                                    </th>

                                    <th>
                                        نوع حساب
                                    </th>

                                    <th>
                                        وضعیت
                                    </th>

                                    <th>
                                        عملیات
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {users.map(
                                    (user) => {

                                        const isCurrent =
                                            currentUser?._id ===
                                            user._id;

                                        const isOwner =
                                            user.role ===
                                            "owner";

                                        return (
                                            <tr
                                                key={
                                                    user._id
                                                }
                                            >

                                                <td>

                                                    <div className="users-name-cell">

                                                        <div className="users-avatar">
                                                            <User
                                                                size={17}
                                                            />
                                                        </div>

                                                        <strong>
                                                            {
                                                                user.username
                                                            }
                                                        </strong>

                                                        {isCurrent && (
                                                            <span className="users-current-badge">
                                                                شما
                                                            </span>
                                                        )}

                                                    </div>

                                                </td>


                                                <td>

                                                    {isOwner ? (
                                                        <span className="users-role owner">
                                                            <ShieldCheck
                                                                size={15}
                                                            />
                                                            مدیر اصلی
                                                        </span>
                                                    ) : (
                                                        <span className="users-role member">
                                                            <User
                                                                size={15}
                                                            />
                                                            کاربر
                                                        </span>
                                                    )}

                                                </td>


                                                <td>

                                                    <span className="users-active-status">
                                                        فعال
                                                    </span>

                                                </td>


                                                <td>

                                                    {!isOwner &&
                                                    !isCurrent ? (
                                                        <button
                                                            type="button"
                                                            className="users-delete-button"
                                                            onClick={() =>
                                                                deleteUser(
                                                                    user._id,
                                                                    user.username
                                                                )
                                                            }
                                                        >

                                                            <Trash2
                                                                size={16}
                                                            />

                                                            حذف

                                                        </button>
                                                    ) : (
                                                        <span className="users-protected">
                                                            <KeyRound
                                                                size={15}
                                                            />
                                                            محافظت‌شده
                                                        </span>
                                                    )}

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </section>

        </main>
    );
}