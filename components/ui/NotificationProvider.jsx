"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Info,
    X,
    Trash2,
} from "lucide-react";

const NotificationContext =
    createContext(null);

export default function NotificationProvider({
    children,
}) {
    const [notifications, setNotifications] =
        useState([]);

    const [confirmDialog, setConfirmDialog] =
        useState(null);

    /* =========================
       Remove Notification
    ========================= */

    const removeNotification =
        useCallback((id) => {
            setNotifications((current) =>
                current.filter(
                    (item) =>
                        item.id !== id
                )
            );
        }, []);

    /* =========================
       Show Notification
    ========================= */

    const showNotification =
        useCallback(
            ({
                type = "info",
                title = "",
                message = "",
                duration = 5000,
            }) => {
                const id =
                    Date.now() +
                    Math.random();

                setNotifications(
                    (current) => [
                        ...current,
                        {
                            id,
                            type,
                            title,
                            message,
                        },
                    ]
                );

                if (duration > 0) {
                    setTimeout(() => {
                        removeNotification(id);
                    }, duration);
                }

                return id;
            },
            [removeNotification]
        );

    /* =========================
       Success
    ========================= */

    const showSuccess =
        useCallback(
            (
                message,
                title = "عملیات موفق"
            ) => {
                return showNotification({
                    type: "success",
                    title,
                    message,
                    duration: 5000,
                });
            },
            [showNotification]
        );

    /* =========================
       Error
    ========================= */

    const showError =
        useCallback(
            (
                message,
                title = "خطا"
            ) => {
                return showNotification({
                    type: "error",
                    title,
                    message,
                    duration: 6000,
                });
            },
            [showNotification]
        );

    /* =========================
       Warning
    ========================= */

    const showWarning =
        useCallback(
            (
                message,
                title = "توجه"
            ) => {
                return showNotification({
                    type: "warning",
                    title,
                    message,
                    duration: 5500,
                });
            },
            [showNotification]
        );

    /* =========================
       Info
    ========================= */

    const showInfo =
        useCallback(
            (
                message,
                title = "اطلاعات"
            ) => {
                return showNotification({
                    type: "info",
                    title,
                    message,
                    duration: 5000,
                });
            },
            [showNotification]
        );

    /* =========================
       Confirm
    ========================= */

    const confirm =
        useCallback(
            ({
                title = "تأیید عملیات",
                message =
                    "آیا از انجام این عملیات مطمئن هستید؟",
                confirmText = "تأیید",
                cancelText = "انصراف",
                danger = false,
            } = {}) => {
                return new Promise(
                    (resolve) => {
                        setConfirmDialog({
                            title,
                            message,
                            confirmText,
                            cancelText,
                            danger,
                            resolve,
                        });
                    }
                );
            },
            []
        );

    /* =========================
       Handle Confirm
    ========================= */

    function handleConfirm(value) {
        if (confirmDialog?.resolve) {
            confirmDialog.resolve(value);
        }

        setConfirmDialog(null);
    }

    /* =========================
       Escape Key
    ========================= */

    useEffect(() => {
        function handleKeyDown(event) {
            if (
                event.key === "Escape" &&
                confirmDialog
            ) {
                handleConfirm(false);
            }
        }

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [confirmDialog]);

    /* =========================
       Icon
    ========================= */

    function getIcon(type) {
        if (type === "success") {
            return (
                <CheckCircle2
                    size={30}
                    strokeWidth={2.2}
                />
            );
        }

        if (type === "error") {
            return (
                <XCircle
                    size={30}
                    strokeWidth={2.2}
                />
            );
        }

        if (type === "warning") {
            return (
                <AlertTriangle
                    size={30}
                    strokeWidth={2.2}
                />
            );
        }

        return (
            <Info
                size={30}
                strokeWidth={2.2}
            />
        );
    }

    return (
        <NotificationContext.Provider
            value={{
                showNotification,
                showSuccess,
                showError,
                showWarning,
                showInfo,
                confirm,
            }}
        >
            {children}

            {/* =========================
                Notifications
            ========================= */}

            <div className="tms-toast-container">

                {notifications.map(
                    (notification) => (
                        <div
                            key={notification.id}
                            className={`tms-toast tms-toast-${notification.type}`}
                        >

                            {/* Icon */}

                            <div className="tms-toast-icon">
                                {getIcon(
                                    notification.type
                                )}
                            </div>

                            {/* Content */}

                            <div className="tms-toast-content">

                                <div className="tms-toast-title">
                                    {
                                        notification.title
                                    }
                                </div>

                                <div className="tms-toast-message">
                                    {
                                        notification.message
                                    }
                                </div>

                            </div>

                            {/* Close */}

                            <button
                                type="button"
                                className="tms-toast-close"
                                onClick={() =>
                                    removeNotification(
                                        notification.id
                                    )
                                }
                                aria-label="بستن"
                            >
                                <X size={20} />
                            </button>

                        </div>
                    )
                )}

            </div>

            {/* =========================
                Confirm Modal
            ========================= */}

            {confirmDialog && (
                <div
                    className="tms-confirm-overlay"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleConfirm(false);
                        }
                    }}
                >

                    <div
                        className="tms-confirm-modal"
                        dir="rtl"
                    >

                        <div
                            className={`tms-confirm-icon ${
                                confirmDialog.danger
                                    ? "danger"
                                    : ""
                            }`}
                        >

                            {confirmDialog.danger ? (
                                <Trash2
                                    size={28}
                                />
                            ) : (
                                <AlertTriangle
                                    size={28}
                                />
                            )}

                        </div>

                        <div className="tms-confirm-content">

                            <h3>
                                {
                                    confirmDialog.title
                                }
                            </h3>

                            <p>
                                {
                                    confirmDialog.message
                                }
                            </p>

                        </div>

                        <div className="tms-confirm-actions">

                            <button
                                type="button"
                                className="tms-confirm-cancel"
                                onClick={() =>
                                    handleConfirm(
                                        false
                                    )
                                }
                            >
                                {
                                    confirmDialog.cancelText
                                }
                            </button>

                            <button
                                type="button"
                                className={`tms-confirm-submit ${
                                    confirmDialog.danger
                                        ? "danger"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleConfirm(
                                        true
                                    )
                                }
                            >
                                {
                                    confirmDialog.confirmText
                                }
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </NotificationContext.Provider>
    );
}

/* =========================
   Hook
========================= */

export function useNotification() {
    const context =
        useContext(
            NotificationContext
        );

    if (!context) {
        throw new Error(
            "useNotification باید داخل NotificationProvider استفاده شود."
        );
    }

    return context;
}