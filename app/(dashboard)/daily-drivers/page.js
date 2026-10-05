"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
    ArrowRight,
    Clock3,
    Plus,
    Trash2,
    UserCheck,
    UserPlus,
    Users,
    RotateCcw,
} from "lucide-react";

import DriverSearchSelect from "@/components/daily-drivers/DriverSearchSelect";

import { useNotification } from "@/components/ui/NotificationProvider";


/* =========================================================
   نوع خودرو
========================================================= */

const vehicleTypes = [
    {
        value: "truck",
        label: "کامیون",
    },
    {
        value: "trailer",
        label: "تریلی",
    },
    {
        value: "pickup",
        label: "وانت",
    },
    {
        value: "van",
        label: "ون",
    },
];


/* =========================================================
   دریافت تاریخ امروز
========================================================= */

function getTodayKey() {
    const now = new Date();

    const parts = new Intl.DateTimeFormat(
        "en-US",
        {
            timeZone: "Asia/Tehran",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }
    ).formatToParts(now);

    const year = parts.find(
        (part) => part.type === "year"
    )?.value;

    const month = parts.find(
        (part) => part.type === "month"
    )?.value;

    const day = parts.find(
        (part) => part.type === "day"
    )?.value;

    return `${year}-${month}-${day}`;
}


/* =========================================================
   تبدیل نوع خودرو به عنوان فارسی
========================================================= */

function getVehicleLabel(vehicleType) {
    const vehicle = vehicleTypes.find(
        (item) => item.value === vehicleType
    );

    return (
        vehicle?.label ||
        vehicleType ||
        "-"
    );
}


/* =========================================================
   صفحه ورود روزانه رانندگان
========================================================= */

export default function DailyDriversPage() {

    /* =====================================================
       Notification
    ===================================================== */

    const {
        showSuccess,
        showError,
        showWarning,
        confirm,
    } = useNotification();


    /* =====================================================
       State
    ===================================================== */

    const [
        driverMode,
        setDriverMode,
    ] = useState("registered");


    const [
        drivers,
        setDrivers,
    ] = useState([]);


    const [
        dailyDrivers,
        setDailyDrivers,
    ] = useState([]);


    const [
        selectedDriver,
        setSelectedDriver,
    ] = useState("");


    const [
        guestDriver,
        setGuestDriver,
    ] = useState({
        name: "",
        phone: "",
        vehicleType: "",
    });


    const [
        loadingDrivers,
        setLoadingDrivers,
    ] = useState(true);


    const [
        loadingDailyDrivers,
        setLoadingDailyDrivers,
    ] = useState(true);


    const [
        saving,
        setSaving,
    ] = useState(false);


    const [
        deletingId,
        setDeletingId,
    ] = useState(null);


    const today = getTodayKey();


    /* =====================================================
       دریافت رانندگان اصلی
    ===================================================== */

    async function fetchDrivers({
        showLoading = false,
        showNotificationOnError = false,
    } = {}) {

        try {

            if (showLoading) {
                setLoadingDrivers(true);
            }


            const response = await fetch(
                "/api/drivers",
                {
                    cache: "no-store",
                }
            );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {
                throw new Error(
                    data.message ||
                    "خطا در دریافت رانندگان"
                );
            }


            setDrivers(
                data.drivers || []
            );

        } catch (err) {

            console.error(
                "Fetch drivers error:",
                err
            );


            /*
              فقط در دریافت اولیه
              پیام خطا نمایش داده شود.

              در Polling نباید هر ۵ ثانیه
              Toast خطا نمایش داده شود.
            */

            if (showNotificationOnError) {

                showError(
                    err.message ||
                    "خطا در دریافت لیست رانندگان",
                    "خطا در دریافت رانندگان"
                );

            }

        } finally {

            if (showLoading) {
                setLoadingDrivers(false);
            }

        }
    }


    /* =====================================================
       دریافت ورودهای امروز
    ===================================================== */

    async function fetchDailyDrivers({
        showLoading = false,
        showNotificationOnError = false,
    } = {}) {

        try {

            if (showLoading) {
                setLoadingDailyDrivers(true);
            }


            const response = await fetch(
                "/api/daily-drivers",
                {
                    cache: "no-store",
                }
            );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {
                throw new Error(
                    data.message ||
                    "خطا در دریافت ورود روزانه رانندگان"
                );
            }


            setDailyDrivers(
                data.dailyDrivers || []
            );

        } catch (err) {

            console.error(
                "Fetch daily drivers error:",
                err
            );


            /*
              اطلاعات قبلی را دست نمی‌زنیم.
              فقط در دریافت اولیه خطا نمایش می‌دهیم.
            */

            if (showNotificationOnError) {

                showError(
                    err.message ||
                    "خطا در دریافت ورود روزانه رانندگان",
                    "خطا در دریافت اطلاعات"
                );

            }

        } finally {

            if (showLoading) {
                setLoadingDailyDrivers(false);
            }

        }
    }


    /* =====================================================
       دریافت اولیه + Polling + Event Sync
    ===================================================== */

    useEffect(() => {

        /*
          دریافت اولیه
        */

        fetchDrivers({
            showLoading: true,
            showNotificationOnError: true,
        });


        fetchDailyDrivers({
            showLoading: true,
            showNotificationOnError: true,
        });


        /*
          Polling هر ۵ ثانیه
        */

        const pollingInterval =
            setInterval(() => {

                fetchDrivers({
                    showLoading: false,
                    showNotificationOnError: false,
                });


                fetchDailyDrivers({
                    showLoading: false,
                    showNotificationOnError: false,
                });

            }, 5000);


        /* =================================================
           Sync فوری ورودهای روزانه
        ================================================= */

        function handleDailyDriversUpdate() {

            fetchDailyDrivers({
                showLoading: false,
                showNotificationOnError: false,
            });

        }


        /* =================================================
           Sync فوری رانندگان اصلی
        ================================================= */

        function handleDriversUpdate() {

            fetchDrivers({
                showLoading: false,
                showNotificationOnError: false,
            });

        }


        window.addEventListener(
            "daily-drivers-updated",
            handleDailyDriversUpdate
        );


        window.addEventListener(
            "drivers-data-updated",
            handleDriversUpdate
        );


        /* =================================================
           Cleanup
        ================================================= */

        return () => {

            clearInterval(
                pollingInterval
            );


            window.removeEventListener(
                "daily-drivers-updated",
                handleDailyDriversUpdate
            );


            window.removeEventListener(
                "drivers-data-updated",
                handleDriversUpdate
            );

        };

    }, []);


    /* =====================================================
       ثبت راننده اصلی
    ===================================================== */

    async function addRegisteredDriver() {

        if (!selectedDriver) {

            showWarning(
                "لطفاً یک راننده را انتخاب کنید.",
                "انتخاب راننده"
            );

            return;
        }


        try {

            setSaving(true);


            const response = await fetch(
                "/api/daily-drivers",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        driverId:
                            selectedDriver,

                        type: "main",

                        date: today,
                    }),
                }
            );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "خطا در ثبت راننده"
                );

            }


            /*
              فعلاً اطلاعات را محلی هم
              به‌روزرسانی می‌کنیم تا UI سریع باشد.
            */

            if (data.dailyDriver) {

                setDailyDrivers(
                    (prev) => [
                        ...prev,
                        data.dailyDriver,
                    ]
                );

            }


            setSelectedDriver("");


            showSuccess(
                "ورود راننده با موفقیت ثبت شد.",
                "ثبت ورود موفق"
            );


            /*
              Sync فوری
            */

            window.dispatchEvent(
                new Event(
                    "daily-drivers-updated"
                )
            );


        } catch (err) {

            console.error(
                "Add registered driver error:",
                err
            );


            showError(
                err.message ||
                "خطا در ثبت ورود راننده",
                "خطا در ثبت ورود"
            );


        } finally {

            setSaving(false);

        }
    }


    /* =====================================================
       ثبت راننده مهمان
    ===================================================== */

    async function addGuestDriver() {

        if (
            !guestDriver.name.trim()
        ) {

            showWarning(
                "نام راننده مهمان را وارد کنید.",
                "نام راننده"
            );

            return;
        }


        if (
            !guestDriver.vehicleType
        ) {

            showWarning(
                "نوع خودرو را انتخاب کنید.",
                "نوع خودرو"
            );

            return;
        }


        try {

            setSaving(true);


            const response = await fetch(
                "/api/daily-drivers",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({

                        name:
                            guestDriver.name.trim(),

                        phone:
                            guestDriver.phone.trim(),

                        vehicleType:
                            guestDriver.vehicleType,

                        type: "guest",

                        date: today,

                    }),
                }
            );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "خطا در ثبت راننده مهمان"
                );

            }


            if (data.dailyDriver) {

                setDailyDrivers(
                    (prev) => [
                        ...prev,
                        data.dailyDriver,
                    ]
                );

            }


            setGuestDriver({
                name: "",
                phone: "",
                vehicleType: "",
            });


            showSuccess(
                "راننده مهمان با موفقیت ثبت شد.",
                "ثبت راننده مهمان موفق"
            );


            /*
              Sync فوری
            */

            window.dispatchEvent(
                new Event(
                    "daily-drivers-updated"
                )
            );


        } catch (err) {

            console.error(
                "Add guest driver error:",
                err
            );


            showError(
                err.message ||
                "خطا در ثبت راننده مهمان",
                "خطا در ثبت راننده مهمان"
            );


        } finally {

            setSaving(false);

        }
    }


    /* =====================================================
       حذف یک راننده از لیست امروز
    ===================================================== */

    async function removeDriver(id) {

        try {

            setDeletingId(id);


            const response = await fetch(
                `/api/daily-drivers?id=${id}`,
                {
                    method: "DELETE",
                }
            );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "خطا در حذف ورود راننده"
                );

            }


            setDailyDrivers(
                (previous) =>
                    previous.filter(
                        (driver) =>
                            driver._id !== id
                    )
            );


            showSuccess(
                "ورود راننده از لیست امروز حذف شد.",
                "حذف موفق"
            );


            /*
              Sync فوری
            */

            window.dispatchEvent(
                new Event(
                    "daily-drivers-updated"
                )
            );


        } catch (err) {

            console.error(
                "Remove driver error:",
                err
            );


            showError(
                err.message ||
                "خطا در حذف ورود راننده",
                "خطا در حذف"
            );


        } finally {

            setDeletingId(null);

        }
    }


    /* =====================================================
       ریست ورودهای امروز
    ===================================================== */

    async function resetTodayDrivers() {

        /*
          اگر لیست خالی است
        */

        if (
            dailyDrivers.length === 0
        ) {

            showWarning(
                "لیست ورود رانندگان امروز خالی است.",
                "لیست خالی است"
            );

            return;
        }


        /*
          تأیید مرکزی
        */

        const confirmed =
            await confirm({

                title:
                    "ریست ورودهای امروز",

                message:
                    "آیا مطمئن هستید که تمام ورودهای ثبت‌شده امروز حذف شوند؟ این عملیات قابل بازگشت نیست.",

                confirmText:
                    "ریست لیست",

                cancelText:
                    "انصراف",

                danger: true,

            });


        if (!confirmed) {
            return;
        }


        try {

            setDeletingId("reset");


            const response = await fetch(
                `/api/daily-drivers?date=${today}&reset=true`,
                {
                    method: "DELETE",
                }
            );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "خطا در ریست لیست"
                );

            }


            setDailyDrivers([]);


            showSuccess(
                "لیست ورود رانندگان امروز با موفقیت ریست شد.",
                "ریست موفق"
            );


            /*
              Sync فوری
            */

            window.dispatchEvent(
                new Event(
                    "daily-drivers-updated"
                )
            );


        } catch (err) {

            console.error(
                "Reset daily drivers error:",
                err
            );


            showError(
                err.message ||
                "خطا در ریست لیست",
                "خطا در ریست لیست"
            );


        } finally {

            setDeletingId(null);

        }
    }


    /* =====================================================
       UI
    ===================================================== */

    return (

        <main className="main-content">

            {/* =================================================
                Header
            ================================================= */}

            <div className="page-heading page-heading-with-action">

                <div>

                    <h1>
                        ورود روزانه رانندگان
                    </h1>

                    <p>
                        ثبت رانندگان حاضر در سرویس امروز
                    </p>

                </div>


                <Link
                    href="/drivers"
                    className="secondary-action-button"
                >

                    <ArrowRight size={18} />

                    <span>
                        مدیریت رانندگان
                    </span>

                </Link>

            </div>


            {/* =================================================
                Add Driver Card
            ================================================= */}

            <section className="daily-driver-add-card">

                <div className="daily-driver-card-header">

                    <div>

                        <h2>
                            ثبت ورود راننده
                        </h2>

                        <p>
                            راننده‌ای که امروز در سرویس حاضر شده
                            است را ثبت کنید.
                        </p>

                    </div>


                    <div className="daily-driver-date">

                        <Clock3 size={17} />

                        <span>
                            امروز
                        </span>

                    </div>

                </div>


                {/* =================================================
                    Mode
                ================================================= */}

                <div className="daily-driver-mode">

                    <button
                        type="button"

                        className={
                            driverMode ===
                                "registered"
                                ? "daily-driver-mode-active"
                                : ""
                        }

                        onClick={() => {

                            setDriverMode(
                                "registered"
                            );

                        }}
                    >

                        <UserCheck size={18} />

                        <span>
                            راننده اصلی
                        </span>

                    </button>


                    <button
                        type="button"

                        className={
                            driverMode === "guest"
                                ? "daily-driver-mode-active"
                                : ""
                        }

                        onClick={() => {

                            setDriverMode(
                                "guest"
                            );

                        }}
                    >

                        <UserPlus size={18} />

                        <span>
                            راننده مهمان
                        </span>

                    </button>

                </div>


                {/* =================================================
                    Registered Driver
                ================================================= */}

                {driverMode ===
                    "registered" && (

                        <div className="daily-driver-form">

                            <div className="daily-driver-field">

                                <label>
                                    انتخاب راننده
                                </label>


                                {loadingDrivers ? (

                                    <div className="daily-driver-loading">

                                        در حال دریافت رانندگان...

                                    </div>

                                ) : (

                                    <DriverSearchSelect
                                        drivers={drivers}

                                        value={
                                            selectedDriver
                                        }

                                        onChange={
                                            setSelectedDriver
                                        }

                                        placeholder="نام راننده را جستجو کنید..."
                                    />

                                )}

                            </div>


                            <button
                                type="button"

                                className="primary-action-button daily-driver-submit"

                                onClick={
                                    addRegisteredDriver
                                }

                                disabled={
                                    saving ||
                                    loadingDrivers ||
                                    !selectedDriver
                                }
                            >

                                <Plus size={19} />

                                <span>

                                    {saving
                                        ? "در حال ثبت..."
                                        : "ثبت ورود راننده"}

                                </span>

                            </button>

                        </div>

                    )}


                {/* =================================================
                    Guest Driver
                ================================================= */}

                {driverMode ===
                    "guest" && (

                        <div className="daily-driver-form daily-driver-guest-form">

                            <div className="daily-driver-field">

                                <label>
                                    نام راننده
                                </label>


                                <input
                                    type="text"

                                    value={
                                        guestDriver.name
                                    }

                                    onChange={(event) =>
                                        setGuestDriver(
                                            (prev) => ({
                                                ...prev,

                                                name:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }

                                    placeholder="نام و نام خانوادگی"
                                />

                            </div>


                            <div className="daily-driver-field">

                                <label>
                                    شماره تماس
                                </label>


                                <input
                                    type="text"

                                    value={
                                        guestDriver.phone
                                    }

                                    onChange={(event) =>
                                        setGuestDriver(
                                            (prev) => ({
                                                ...prev,

                                                phone:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }

                                    placeholder="شماره موبایل"
                                />

                            </div>


                            <div className="daily-driver-field">

                                <label>
                                    نوع خودرو
                                </label>


                                <select
                                    value={
                                        guestDriver.vehicleType
                                    }

                                    onChange={(event) =>
                                        setGuestDriver(
                                            (prev) => ({
                                                ...prev,

                                                vehicleType:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                >

                                    <option value="">
                                        انتخاب نوع خودرو
                                    </option>


                                    {vehicleTypes.map(
                                        (vehicle) => (

                                            <option
                                                key={
                                                    vehicle.value
                                                }

                                                value={
                                                    vehicle.value
                                                }
                                            >
                                                {
                                                    vehicle.label
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            <button
                                type="button"

                                className="primary-action-button daily-driver-submit"

                                onClick={
                                    addGuestDriver
                                }

                                disabled={
                                    saving
                                }
                            >

                                <Plus size={19} />

                                <span>

                                    {saving
                                        ? "در حال ثبت..."
                                        : "ثبت راننده مهمان"}

                                </span>

                            </button>

                        </div>

                    )}

            </section>


            {/* =================================================
                Daily Drivers List
            ================================================= */}

            <section className="daily-driver-list-card">

                <div className="daily-driver-list-header">

                    <div>

                        <h2>
                            رانندگان حاضر امروز
                        </h2>

                        <p>
                            لیست رانندگانی که برای امروز ثبت
                            شده‌اند.
                        </p>

                    </div>


                    <div className="daily-driver-list-actions">

                        <button
                            type="button"

                            className="daily-driver-reset-button"

                            onClick={
                                resetTodayDrivers
                            }

                            disabled={
                                deletingId ===
                                "reset"
                            }
                        >

                            <RotateCcw
                                size={16}

                                className={
                                    deletingId ===
                                        "reset"
                                        ? "daily-driver-reset-spinning"
                                        : ""
                                }
                            />


                            <span>

                                {deletingId ===
                                    "reset"
                                    ? "در حال ریست..."
                                    : "ریست لیست"}

                            </span>

                        </button>


                        <div className="daily-driver-count">

                            <Users size={17} />

                            <span>
                                {
                                    dailyDrivers.length
                                }{" "}
                                راننده
                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    Loading
                ================================================= */}

                {loadingDailyDrivers ? (

                    <div className="daily-driver-empty">

                        <Clock3 size={30} />

                        <strong>
                            در حال دریافت اطلاعات...
                        </strong>

                    </div>

                ) : dailyDrivers.length === 0 ? (

                    /* =================================================
                       Empty
                    ================================================= */

                    <div className="daily-driver-empty">

                        <Users size={32} />

                        <strong>
                            هنوز راننده‌ای برای امروز ثبت نشده
                        </strong>

                        <span>
                            از قسمت بالا ورود راننده را ثبت
                            کنید.
                        </span>

                    </div>

                ) : (

                    /* =================================================
                       Table
                    ================================================= */

                    <div className="daily-driver-table-wrapper">

                        <table className="daily-driver-table">

                            <thead>

                                <tr>

                                    <th>
                                        راننده
                                    </th>

                                    <th>
                                        شماره تماس
                                    </th>

                                    <th>
                                        نوع خودرو
                                    </th>

                                    <th>
                                        نوع ورود
                                    </th>

                                    <th>
                                        ساعت ورود
                                    </th>

                                    <th>
                                        عملیات
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {dailyDrivers.map(
                                    (driver) => (

                                        <tr
                                            key={
                                                driver._id
                                            }
                                        >

                                            {/* راننده */}

                                            <td>

                                                <div className="daily-driver-name">

                                                    <div className="daily-driver-avatar">

                                                        {
                                                            driver.name?.charAt(
                                                                0
                                                            )
                                                        }

                                                    </div>


                                                    <div>

                                                        <strong>
                                                            {
                                                                driver.name
                                                            }
                                                        </strong>


                                                        {driver.type ===
                                                            "main" && (

                                                                <span>
                                                                    راننده ثبت‌شده
                                                                </span>

                                                            )}


                                                        {driver.type ===
                                                            "guest" && (

                                                                <span>
                                                                    مهمان
                                                                </span>

                                                            )}

                                                    </div>

                                                </div>

                                            </td>


                                            {/* شماره تماس */}

                                            <td>

                                                {
                                                    driver.phone ||
                                                    "-"
                                                }

                                            </td>


                                            {/* نوع خودرو */}

                                            <td>

                                                {getVehicleLabel(
                                                    driver.vehicleType
                                                )}

                                            </td>


                                            {/* نوع ورود */}

                                            <td>

                                                <span
                                                    className={`daily-driver-type-badge ${driver.type ===
                                                            "main"
                                                            ? "daily-driver-type-main"
                                                            : "daily-driver-type-guest"
                                                        }`}
                                                >

                                                    {driver.type ===
                                                        "main"
                                                        ? "اصلی"
                                                        : "مهمان"}

                                                </span>

                                            </td>


                                            {/* ساعت ورود */}

                                            <td>

                                                {
                                                    driver.entryTime
                                                }

                                            </td>


                                            {/* عملیات */}

                                            <td>

                                                <button
                                                    type="button"

                                                    className="daily-driver-delete-button"

                                                    onClick={() =>
                                                        removeDriver(
                                                            driver._id
                                                        )
                                                    }

                                                    disabled={
                                                        deletingId ===
                                                        driver._id
                                                    }

                                                    title="حذف ورود"
                                                >

                                                    <Trash2
                                                        size={
                                                            17
                                                        }
                                                    />

                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </main>
    );
}